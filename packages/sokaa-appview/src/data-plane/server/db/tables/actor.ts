export const tableName = 'actor'

import { Generated } from 'kysely'

export interface Actor {
  did: string
  handle: string | null
  pdsEndpoint: string | null
  displayName: string | null
  description: string | null
  avatarCid: string | null
  bannerCid: string | null
  followersCount: Generated<number>
  postsCount: Generated<number>
  upstreamStatus: Generated<string>
  indexedAt: string
}

export type PartialDB = { [tableName]: Actor }
