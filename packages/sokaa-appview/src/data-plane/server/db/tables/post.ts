export const tableName = 'post'

import { Generated } from 'kysely'

export interface Post {
  uri: string
  cid: string
  creator: string
  caption: string | null
  mediaType: string | null
  mediaJson: unknown | null
  likeCount: Generated<number>
  createdAt: string
  indexedAt: string
}

export type PartialDB = { [tableName]: Post }
