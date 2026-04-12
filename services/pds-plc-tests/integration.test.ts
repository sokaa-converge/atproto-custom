import { AtpAgent } from '@atproto/api'

const PDS_URL = process.env.PDS_URL ?? 'http://localhost:3000'

// Unique suffix per run so handles never collide across test runs
const suffix = Date.now().toString(36)

describe('PDS + PLC integration', () => {
  const agent = new AtpAgent({ service: PDS_URL })

  let did: string
  let postUri: string
  let postCid: string

  const handle = `testuser${suffix}.test`
  const email = `testuser${suffix}@example.com`
  const password = 'hunter2-integration-test'

  // ─── create_user ────────────────────────────────────────────────────────────

  it('create_user — registers a new account', async () => {
    const res = await agent.com.atproto.server.createAccount({
      handle,
      email,
      password,
    })
    expect(res.success).toBe(true)
    expect(res.data.did).toMatch(/^did:/)
    expect(res.data.handle).toBe(handle)
    expect(res.data.accessJwt).toBeTruthy()

    did = res.data.did
    agent.setHeader('Authorization', `Bearer ${res.data.accessJwt}`)
  })

  // ─── make_post ──────────────────────────────────────────────────────────────

  it('make_post — creates a feed post record', async () => {
    const res = await agent.com.atproto.repo.createRecord({
      repo: did,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        text: `Hello from integration test! (${suffix})`,
        createdAt: new Date().toISOString(),
      },
    })
    expect(res.success).toBe(true)
    expect(res.data.uri).toMatch(/^at:\/\//)
    expect(res.data.cid).toBeTruthy()

    postUri = res.data.uri
    postCid = res.data.cid
  })

  // ─── get_post ───────────────────────────────────────────────────────────────

  it('get_post — retrieves the exact record by AT URI', async () => {
    // AT URI format: at://did/collection/rkey
    const parts = postUri.replace('at://', '').split('/')
    const [repoDid, collection, rkey] = parts

    const res = await agent.com.atproto.repo.getRecord({
      repo: repoDid,
      collection,
      rkey,
    })
    expect(res.success).toBe(true)
    expect(res.data.uri).toBe(postUri)
    expect(res.data.cid).toBe(postCid)
    expect((res.data.value as { text: string }).text).toBe(
      `Hello from integration test! (${suffix})`,
    )
  })

  // ─── get_user ───────────────────────────────────────────────────────────────

  it('get_user — describes the repo and confirms handle + collections', async () => {
    const res = await agent.com.atproto.repo.describeRepo({ repo: did })
    expect(res.success).toBe(true)
    expect(res.data.did).toBe(did)
    expect(res.data.handle).toBe(handle)
    expect(res.data.collections).toContain('app.bsky.feed.post')
  })

  // ─── get_user_feed ──────────────────────────────────────────────────────────
  // No AppView running, so we use listRecords directly on the PDS repo.

  it('get_user_feed — lists posts in the user repo', async () => {
    const res = await agent.com.atproto.repo.listRecords({
      repo: did,
      collection: 'app.bsky.feed.post',
    })
    expect(res.success).toBe(true)
    expect(res.data.records.length).toBeGreaterThanOrEqual(1)

    const match = res.data.records.find((r) => r.uri === postUri)
    expect(match).toBeDefined()
    expect(match?.cid).toBe(postCid)
  })
})
