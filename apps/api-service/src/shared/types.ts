export type GetMaybePromise<T> = T extends Promise<infer R> ? R : T
export type GetProviderType<T> = T extends { useFactory: (...args: any[]) => infer R } ? GetMaybePromise<R> : never

import { EntitySchema } from 'typeorm'

export type GetEntity<T> = T extends EntitySchema<infer U> ? U : never

export interface WhereParams<Extract extends string = string, Exclude extends string = never> {
  page?: number
  pageSize?: number
  search?: string
  sort?: string | string[]
  filter?: Extract | Extract[]
  exclude?: Exclude | Exclude[]
}

export interface QueryParams<Extract extends string = string, Exclude extends string = never> extends WhereParams<Extract, Exclude> {
  page?: number
  pageSize?: number
}

export interface QueryOptions {
  selects?: string[]
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
