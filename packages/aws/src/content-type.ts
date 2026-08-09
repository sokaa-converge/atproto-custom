/**
 * Resolve Content-Type for S3/R2 blob uploads.
 * Prefer an explicit mime from the PDS upload path; otherwise sniff magic bytes
 * when the body is already buffered.
 */
export function resolveUploadContentType(
  _bytes: Uint8Array | NodeJS.ReadableStream,
  _explicit?: string,
): string | undefined {
  throw new Error('not implemented')
}

export function sniffContentTypeFromBytes(
  _bytes: Uint8Array,
): string | undefined {
  throw new Error('not implemented')
}
