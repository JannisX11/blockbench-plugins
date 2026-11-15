import {
  BLOCKBENCH_API,
  HANDOFF_CONTENT_TYPE,
  HANDOFF_FILE_NAME_HEADER,
} from "@workspace/blockbench-protocol"
import type {
  DeviceStartRequest,
  DeviceStartResponse,
  TokenRequest,
  TokenResponse,
  LinkedAccount,
  HandoffResponse,
  ErrorResponse,
} from "@workspace/blockbench-protocol"
import { ApiError } from "./errors"
import { checkSize } from "./project"
import { serverOrigin } from "./token-store"
import type { TokenStore } from "./token-store"

export class WorkshopClient {
  readonly origin: string
  constructor(
    origin: string,
    private readonly tokens: TokenStore,
    private readonly fetcher: typeof fetch
  ) {
    this.origin = serverOrigin(origin)
  }

  private async request<TResult>(
    path: string,
    init: RequestInit,
    authenticated = false
  ): Promise<TResult> {
    const headers = new Headers(init.headers)
    const token = authenticated ? this.tokens.get() : null
    if (authenticated) {
      if (!token)
        throw new ApiError(
          { error: "invalid_token", message: "Link your account first." },
          401
        )
      headers.set("Authorization", `Bearer ${token}`)
    }
    const response = await this.fetcher(this.origin + path, {
      ...init,
      headers,
      credentials: "omit",
      redirect: "error",
    })
    if (!response.ok) {
      let body: ErrorResponse
      try {
        const value: unknown = await response.json()
        if (
          !value ||
          typeof value !== "object" ||
          !("error" in value) ||
          !("message" in value) ||
          typeof value.error !== "string" ||
          typeof value.message !== "string"
        )
          throw new Error("Invalid error response")
        body = value as ErrorResponse
      } catch {
        body = {
          error: "unavailable",
          message: `Blockbench Workshop returned HTTP ${response.status}. Please try again.`,
        }
      }
      // A late response must not clear a newer link made in the meantime.
      if (
        body.error === "invalid_token" &&
        token &&
        this.tokens.get() === token
      )
        this.tokens.clear()
      throw new ApiError(body, response.status)
    }
    if (response.status === 204) return undefined as TResult
    return (await response.json()) as TResult
  }

  device(
    body: DeviceStartRequest,
    signal?: AbortSignal
  ): Promise<DeviceStartResponse> {
    return this.request(BLOCKBENCH_API.device, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    })
  }
  token(body: TokenRequest, signal?: AbortSignal): Promise<TokenResponse> {
    return this.request(BLOCKBENCH_API.token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    })
  }
  account(signal?: AbortSignal): Promise<LinkedAccount> {
    return this.request(BLOCKBENCH_API.account, { method: "GET", signal }, true)
  }
  revokeToken(token: string, signal?: AbortSignal): Promise<void> {
    return this.request(BLOCKBENCH_API.token, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
  }
  async signOut(signal?: AbortSignal): Promise<void> {
    try {
      await this.request(
        BLOCKBENCH_API.token,
        { method: "DELETE", signal },
        true
      )
    } finally {
      this.tokens.clear()
    }
  }
  handoff(
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    signal?: AbortSignal
  ): Promise<HandoffResponse> {
    checkSize(bytes.byteLength)
    return this.request(
      BLOCKBENCH_API.handoffs,
      {
        method: "POST",
        signal,
        headers: {
          "Content-Type": HANDOFF_CONTENT_TYPE,
          [HANDOFF_FILE_NAME_HEADER]: encodeURIComponent(fileName),
        },
        body: bytes,
      },
      true
    )
  }
  websiteUrl(value: string): string {
    const url = new URL(value)
    if (url.origin !== this.origin || url.username || url.password)
      throw new Error(
        "Blockbench Workshop returned a link to an unexpected server."
      )
    return url.href
  }
}
