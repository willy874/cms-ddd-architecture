export type GetMaybePromise<T> = T extends Promise<infer R> ? R : T
export type GetProviderType<T> = T extends { useFactory: (...args: any[]) => infer R } ? GetMaybePromise<R> : never

export type { DeepPartial } from 'typeorm'

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  filter?: string | string[]
  sort?: string | string[]
}
