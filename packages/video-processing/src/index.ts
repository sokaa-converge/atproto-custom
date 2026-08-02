export * from './types'
export { CloudflareStreamClient } from './cloudflare-stream'
export type { CloudflareStreamConfig } from './cloudflare-stream'
export { HttpReadinessChecker } from './readiness'
export { VideoJobService } from './job-service'

/** Build the gateway URL Stream (or ops) can use to fetch the original MP4. */
export function mediaSourceUrl(
  cdnUrl: string,
  did: string,
  videoCid: string,
): string {
  const base = cdnUrl.replace(/\/+$/, '')
  return `${base}/v1/media/${encodeURIComponent(did)}/${encodeURIComponent(videoCid)}`
}

/** Optional mirrored HLS object prefix under private R2. */
export function videoAssetKeyPrefix(did: string, videoCid: string): string {
  return `video/${did}/${videoCid}`
}
