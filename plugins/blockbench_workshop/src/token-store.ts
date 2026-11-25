export type TokenStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">

export const DEFAULT_ORIGIN = "https://blockbenchworkshop.com"

export function serverOrigin(value: string): string {
  const url = new URL(value.trim())
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if (
    (url.protocol !== "https:" && !(local && url.protocol === "http:")) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Enter an HTTPS server origin, or HTTP localhost for development (no path or credentials)."
    )
  }
  return url.origin
}

export class TokenStore {
  private readonly key: string
  constructor(
    private readonly storage: TokenStorage,
    origin: string
  ) {
    this.key = `blockbench_workshop:token:${encodeURIComponent(serverOrigin(origin))}`
  }
  get(): string | null {
    return this.storage.getItem(this.key)
  }
  set(token: string): void {
    this.storage.setItem(this.key, token)
  }
  clear(): void {
    this.storage.removeItem(this.key)
  }
}
