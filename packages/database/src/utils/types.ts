import { EntitySchema } from "typeorm"

export type GetEntity<T> = T extends EntitySchema<infer U> ? U : never

export interface QueryParams {
  page?: number
  pageSize?: number
  searchMode?: 'like' | 'equal'
  search?: string
  searchField?: string | string[]
  sort?: string | string[]
  filter?: string | string[]
}

export type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
}
