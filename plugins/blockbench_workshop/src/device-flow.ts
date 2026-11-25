import { POLL_INTERVAL_SECONDS } from "@workspace/blockbench-protocol"
import type {
  DeviceStartResponse,
  TokenResponse,
} from "@workspace/blockbench-protocol"
import { ApiError } from "./errors"

export type PollClock = {
  timeout: (callback: () => void, milliseconds: number) => () => void
  now: () => number
  sleep: (milliseconds: number, signal: AbortSignal) => Promise<void>
}

export const pollClock: PollClock = {
  now: () => Date.now(),
  timeout: (callback, milliseconds) => {
    const timer = setTimeout(callback, milliseconds)
    return () => clearTimeout(timer)
  },
  sleep: (milliseconds, signal) =>
    new Promise((resolve, reject) => {
      signal.throwIfAborted()
      const abort = () => {
        clearTimeout(timer)
        reject(new DOMException("Linking cancelled.", "AbortError"))
      }
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort)
        resolve()
      }, milliseconds)
      signal.addEventListener("abort", abort, { once: true })
    }),
}

export async function pollForToken(
  device: DeviceStartResponse,
  request: (signal: AbortSignal) => Promise<TokenResponse>,
  signal: AbortSignal,
  clock: PollClock = pollClock
): Promise<TokenResponse> {
  const deadline = clock.now() + device.expiresIn * 1000
  let interval = Math.max(device.interval, POLL_INTERVAL_SECONDS) * 1000
  const expired = () =>
    new ApiError(
      {
        error: "expired_token",
        message:
          "This link code expired. Link your account again to get a new code.",
      },
      400
    )
  while (true) {
    signal.throwIfAborted()
    if (clock.now() >= deadline) throw expired()
    await clock.sleep(Math.min(interval, deadline - clock.now()), signal)
    signal.throwIfAborted()
    if (clock.now() >= deadline) throw expired()
    const controller = new AbortController()
    const cancel = () => controller.abort(signal.reason)
    signal.addEventListener("abort", cancel, { once: true })
    let clearDeadline = () => {}
    const timeout = new Promise<never>((_resolve, reject) => {
      clearDeadline = clock.timeout(() => {
        reject(expired())
        controller.abort()
      }, deadline - clock.now())
    })
    try {
      const result = await Promise.race([request(controller.signal), timeout])
      signal.throwIfAborted()
      // A successful request may have spent the grant before expiry. Keep its
      // token even if the local clock crossed the deadline while handling it.
      return result
    } catch (error) {
      signal.throwIfAborted()
      if (!(error instanceof ApiError)) throw error
      if (error.body.error === "slow_down") {
        interval = Math.max(
          interval + POLL_INTERVAL_SECONDS * 1000,
          (error.body.retryAfter ?? 0) * 1000
        )
      } else if (error.body.error !== "authorization_pending") throw error
    } finally {
      clearDeadline()
      signal.removeEventListener("abort", cancel)
    }
  }
}
