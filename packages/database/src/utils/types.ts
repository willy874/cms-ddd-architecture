import { EntitySchema } from "typeorm"

export type GetEntity<T> = T extends EntitySchema<infer U> ? U : never

export interface QueryParams {
  page?: number
  pageSize?: number
  search?: string
  sort?: string | string[]
  searchField?: string | string[]
  filter?: string | string[]
}

