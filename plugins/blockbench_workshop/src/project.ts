import {
  HANDOFF_MAX_BYTES,
  HANDOFF_FILE_NAME_MAX_LENGTH,
} from "@workspace/blockbench-protocol"

export function checkSize(bytes: number): void {
  if (bytes > HANDOFF_MAX_BYTES)
    throw new Error(
      `This model is too large. Blockbench Workshop accepts up to ${HANDOFF_MAX_BYTES / 1024 / 1024} MB.`
    )
}

export function prepareProject(
  compiled: unknown,
  name?: string
): { bytes: Uint8Array<ArrayBuffer>; fileName: string } {
  if (typeof compiled !== "string")
    throw new Error(
      "Blockbench could not compile this project as a .bbmodel file."
    )
  const bytes = new TextEncoder().encode(compiled)
  checkSize(bytes.byteLength)
  // Replace control characters as well as characters unsafe in file names.
  const stem = (name?.trim() || "Untitled")
    .replace(/\.bbmodel$/i, "")
    // oxlint-disable-next-line no-control-regex -- control characters are what this removes
    .replace(/[/\\:*?"<>|\x00-\x1f]/g, "_")
  const limit = HANDOFF_FILE_NAME_MAX_LENGTH - ".bbmodel".length
  let truncated = ""
  for (const point of stem) {
    if (truncated.length + point.length > limit) break
    truncated += point
  }
  return { bytes, fileName: `${truncated}.bbmodel` }
}
