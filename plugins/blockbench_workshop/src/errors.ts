import type { ErrorResponse } from "@workspace/blockbench-protocol"

export class ApiError extends Error {
  constructor(
    readonly body: ErrorResponse,
    readonly status: number
  ) {
    super(body.message)
    this.name = "ApiError"
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body.error === "invalid_token") {
    return "Your Blockbench Workshop link has expired or was revoked. Link your account again."
  }
  if (error instanceof TypeError)
    return "Could not reach Blockbench Workshop. Check your connection and server setting, then try again."
  return error instanceof Error
    ? error.message
    : "Blockbench Workshop could not complete the request. Please try again."
}
