export type GetMaybePromise<T> = T extends Promise<infer R> ? R : T
export type GetProviderType<T> = T extends { useFactory: (...args: any[]) => infer R } ? GetMaybePromise<R> : never

import { EntitySchema } from 'typeorm'

export type GetEntity<T> = T extends EntitySchema<infer U> ? U : never

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string | string[]
  filter?: string | string[]
  exclude?: string | string[]
}

// export interface SearchRule {}

export interface SearchQueryParams extends QueryParams {
  rules: []
}

export type QueryPageResult<T = any> = {
  list: T[]
  page: number
  pageSize: number
  total: number
}
