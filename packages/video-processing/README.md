# `@atproto/video-processing`

Cloudflare Stream job contract for Sokaa video embeds.

## Responsibilities

- Idempotent submit keyed by `did + videoCid`
- Readiness gate before `ready` (playlist HEAD/GET + first segment when possible)
- Retryable vs permanent failure categories
- Stream delete for moderation/account takedown (< 1 hour SLA)
- Same-origin `/v1/media` source URL allowlist for Stream copy

## AppView integration

Sokaa AppView stores rows in `video_asset` and exposes:

- `POST /_sokaa/video/jobs` — admin Basic auth
- `DELETE /_sokaa/video/jobs/:did/:cid` — admin Basic auth
- `POST /_sokaa/video/webhooks/stream` — `SOKAA_STREAM_WEBHOOK_SECRET`
  via `Authorization: Bearer …` or `X-Sokaa-Webhook-Secret`

Required env (never commit):

- `SOKAA_STREAM_ACCOUNT_ID`
- `SOKAA_STREAM_API_TOKEN`
- `SOKAA_STREAM_CUSTOMER_SUBDOMAIN` (e.g. `https://customer-xxx.cloudflarestream.com`)
- `SOKAA_STREAM_WEBHOOK_SECRET`

## Cost / policy

See `sokaa` ADR `docs/decisions/video-processing.md`:

- Steady ceiling $150/mo (bootstrap toward $500/mo)
- Deletion SLA < 1 hour via Stream Delete API + R2 prefix purge
