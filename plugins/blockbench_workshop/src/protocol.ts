// The HTTP contract between Blockbench Workshop (apps/web) and the Blockbench
// plugin (apps/blockbench-plugin). Both sides import this file, so a change to
// a path, a field or an error code is a compile error on the side that did not
// follow. Types and constants only: the plugin bundles this into a single file
// for Blockbench's plugin repository, so it must stay dependency-free.
//
// The flow, end to end:
//
// 1. Link (an RFC 8628 device authorization grant, narrowed to one client).
//    The plugin POSTs `device` and gets a secret device code plus a short user
//    code. It opens `verificationUriComplete` in the browser, where the signed
//    in creator compares the code with the one Blockbench shows and approves
//    it. Meanwhile the plugin polls `token` with the device code; once approved
//    it receives an access token, which is the only credential it keeps.
// 2. Send. The plugin POSTs the compiled .bbmodel to `handoffs` with that
//    token. The server stores it as a private, expiring upload and answers with
//    `openUrl`: the normal upload page with this file preloaded. The creator
//    finishes the listing there, with every field, check and limit the website
//    already applies. The plugin never publishes on its own, because previews,
//    turntables and share cards are rendered by the website's upload page.
//
// Versioned by path: a breaking change adds /v2 next to /v1, and the server
// keeps /v1 until old plugins have had time to update.

export const PROTOCOL_VERSION = 1

const ROOT = "/api/blockbench/v1"

export const BLOCKBENCH_API = {
  /** POST DeviceStartRequest → DeviceStartResponse. Unauthenticated. */
  device: `${ROOT}/device`,
  /**
   * POST TokenRequest → TokenResponse (poll until approved).
   * DELETE with the bearer token → 204 (sign out of this Blockbench).
   */
  token: `${ROOT}/token`,
  /** GET with the bearer token → LinkedAccount. */
  account: `${ROOT}/account`,
  /**
   * POST with the bearer token. The body is the raw .bbmodel bytes with
   * Content-Type HANDOFF_CONTENT_TYPE and a Content-Length. The optional
   * HANDOFF_FILE_NAME_HEADER carries the URI-encoded file name.
   * → 201 HandoffResponse.
   */
  handoffs: `${ROOT}/handoffs`,
} as const

/** The website page where a signed-in creator approves a user code. */
export const LINK_PAGE_PATH = "/link/blockbench"
/** The query parameter on LINK_PAGE_PATH that carries the user code. */
export const LINK_PAGE_CODE_PARAM = "code"

/** Request headers the plugin sends; the server's CORS policy allows these. */
export const HANDOFF_FILE_NAME_HEADER = "X-BBW-File-Name"
export const ALLOWED_REQUEST_HEADERS = [
  "Authorization",
  "Content-Type",
  HANDOFF_FILE_NAME_HEADER,
] as const

/**
 * The content type of a sent model. It is the master upload's content type on
 * the website (apps/web/src/lib/upload-artifacts.ts), asserted equal by a web
 * test, so a sent file is stored exactly like a file picked on the upload page.
 */
export const HANDOFF_CONTENT_TYPE = "application/octet-stream"
/**
 * The largest model the website accepts, the master upload's cap. The plugin
 * checks it before sending; the server enforces it on the real bytes.
 */
export const HANDOFF_MAX_BYTES = 25 * 1024 * 1024
/** The longest file name the server keeps; longer names are cut. */
export const HANDOFF_FILE_NAME_MAX_LENGTH = 120

/** How long a device code (and its user code) stays usable. */
export const DEVICE_CODE_TTL_SECONDS = 10 * 60
/** The slowest a plugin polls `token`; `slow_down` adds this much again. */
export const POLL_INTERVAL_SECONDS = 5

// User codes follow RFC 8628 §6.1: consonants only (no vowels, so no words),
// no easily confused letters, and case-insensitive. 20^8 ≈ 2.6e10 codes, and
// the server limits approval attempts per account, so guessing is not viable.
export const USER_CODE_ALPHABET = "BCDFGHJKLMNPQRSTVWXZ"
export const USER_CODE_LENGTH = 8

/**
 * "BCDFGHJK" → "BCDF-GHJK", the form shown in Blockbench and on the website.
 * Idempotent: an already formatted code comes back unchanged.
 */
export function formatUserCode(code: string): string {
  const plain = code.replace(/-/g, "")
  return `${plain.slice(0, USER_CODE_LENGTH / 2)}-${plain.slice(USER_CODE_LENGTH / 2)}`
}

/**
 * Accepts what a person might type (lower case, spaces, a dash) and returns the
 * canonical eight capitals, or null when it cannot be a user code.
 */
export function normalizeUserCode(input: string): string | null {
  const code = input.toUpperCase().replace(/[\s-]/g, "")
  if (code.length !== USER_CODE_LENGTH) return null
  for (const char of code) if (!USER_CODE_ALPHABET.includes(char)) return null
  return code
}

/** Where the plugin runs. Shown to the creator on the approval page. */
export type BlockbenchClient = "desktop" | "web"

export type DeviceStartRequest = {
  client: BlockbenchClient
  /** The plugin's own semver version, for the approval page and support. */
  pluginVersion: string
}

export type DeviceStartResponse = {
  /** Secret. Only the plugin knows it; it exchanges it for the token. */
  deviceCode: string
  /** Public, already formatted as XXXX-XXXX; the creator compares it. */
  userCode: string
  /** The approval page without the code, for typing it by hand. */
  verificationUri: string
  /** The approval page with the code filled in. */
  verificationUriComplete: string
  expiresIn: number
  /** Seconds between polls of `token`. */
  interval: number
}

export type TokenRequest = { deviceCode: string }

/** The creator account a token publishes to. */
export type LinkedAccount = {
  handle: string | null
  name: string
  image: string | null
  /** Absolute URL of the public profile, or null before a handle is chosen. */
  profileUrl: string | null
}

export type TokenResponse = {
  /** Opaque bearer token. Send as `Authorization: Bearer <token>`. */
  accessToken: string
  account: LinkedAccount
}

export type HandoffResponse = {
  id: string
  /** Absolute URL of the upload page with this model preloaded. */
  openUrl: string
  expiresIn: number
}

export type ErrorCode =
  // Polling `token`: keep polling.
  | "authorization_pending"
  // Polling `token`: keep polling, but add POLL_INTERVAL_SECONDS to the wait.
  | "slow_down"
  // Polling `token`: the creator declined. Stop.
  | "access_denied"
  // Polling `token`: the device code expired or was used. Start again.
  | "expired_token"
  // Any bearer call: the token is unknown, revoked or unused for too long.
  // Forget it and link again.
  | "invalid_token"
  // The account cannot publish now (suspended, email not verified, on hold).
  // `message` says why and what to do.
  | "account_unavailable"
  | "invalid_request"
  | "too_large"
  | "rate_limited"
  // The creator's upload storage budget is full; `message` says what to do.
  | "storage_full"
  | "unavailable"

/** Every non-2xx response body. `message` is written for the creator. */
export type ErrorResponse = {
  error: ErrorCode
  message: string
  /** Seconds, present when waiting will help (rate_limited, slow_down). */
  retryAfter?: number
}
