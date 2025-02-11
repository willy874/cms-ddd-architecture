import { DataSource } from 'typeorm'

export const INJECT_DATABASE = 'DATA_SOURCE'
export type Database = {
  query: DataSource['query']
  getRepository: DataSource['getRepository']
}

type GetMaybePromise<T> = T extends Promise<infer R> ? R : T
export type GetProviderType<T> = T extends { useFactory: (...args: any[]) => infer R } ? GetMaybePromise<R> : never
