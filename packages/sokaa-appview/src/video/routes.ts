import { Router } from 'express'
import {
  CloudflareStreamClient,
  HttpReadinessChecker,
  VideoJobService,
  mediaSourceUrl,
} from '@atproto/video-processing'
import { AppContext } from '../context'
import { Database } from '../data-plane/server/db'
import { DbVideoAssetStore } from './db-asset-store'

export type VideoRouteDeps = {
  ctx: AppContext
  db: Database
}

/**
 * Internal video processing routes (admin basic-auth).
 * - POST /_sokaa/video/jobs — submit/copy to Cloudflare Stream
 * - POST /_sokaa/video/webhooks/stream — Stream ready webhook
 * - DELETE /_sokaa/video/jobs/:did/:cid — takedown (<1h SLA path)
 */
export function createVideoRouter(deps: VideoRouteDeps): Router {
  const router = Router()
  const service = createJobService(deps)

  router.use((req, res, next) => {
    const creds = deps.ctx.authVerifier.parseRoleCreds(req)
    if (!creds.admin) {
      res.set('WWW-Authenticate', 'Basic realm="sokaa-video"')
      res.status(401).send('Unauthorized\n')
      return
    }
    next()
  })

  router.post('/jobs', async (req, res) => {
    if (!service) {
      res.status(503).send('Stream credentials not configured\n')
      return
    }
    const did = String(req.body?.did ?? '')
    const videoCid = String(req.body?.videoCid ?? '')
    if (!did || !videoCid) {
      res.status(400).send('did and videoCid required\n')
      return
    }
    const sourceUrl =
      typeof req.body?.sourceUrl === 'string' && req.body.sourceUrl
        ? req.body.sourceUrl
        : mediaSourceUrl(deps.ctx.cfg.cdnUrl, did, videoCid)
    const record = await service.submit({ did, videoCid, sourceUrl })
    res.status(200).json(record)
  })

  router.post('/webhooks/stream', async (req, res) => {
    if (!service) {
      res.status(503).send('Stream credentials not configured\n')
      return
    }
    const did = String(req.body?.meta?.did ?? req.body?.did ?? '')
    const videoCid = String(
      req.body?.meta?.videoCid ?? req.body?.videoCid ?? '',
    )
    const streamUid = String(req.body?.uid ?? req.body?.streamUid ?? '')
    if (!did || !videoCid || !streamUid) {
      res.status(400).send('did, videoCid, and stream uid required\n')
      return
    }
    const record = await service.markReadyFromWebhook(did, videoCid, streamUid)
    res.status(200).json(record ?? { ok: false })
  })

  router.delete('/jobs/:did/:cid', async (req, res) => {
    if (!service) {
      res.status(503).send('Stream credentials not configured\n')
      return
    }
    const did = decodeURIComponent(req.params.did)
    const videoCid = decodeURIComponent(req.params.cid)
    const record = await service.delete(did, videoCid)
    res.status(200).json(record ?? { ok: false })
  })

  return router
}

function createJobService(deps: VideoRouteDeps): VideoJobService | null {
  const accountId = process.env.SOKAA_STREAM_ACCOUNT_ID?.trim()
  const apiToken = process.env.SOKAA_STREAM_API_TOKEN?.trim()
  const customerSubdomain = process.env.SOKAA_STREAM_CUSTOMER_SUBDOMAIN?.trim()
  if (!accountId || !apiToken || !customerSubdomain) {
    return null
  }
  return new VideoJobService(
    new DbVideoAssetStore(deps.db),
    new CloudflareStreamClient({ accountId, apiToken, customerSubdomain }),
    new HttpReadinessChecker(),
  )
}
