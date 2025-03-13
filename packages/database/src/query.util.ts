import { FindOperator, Like, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'
import { z } from 'zod'

export type QueryFn<T extends ObjectLiteral> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
export type QueryPipeFn<T extends ObjectLiteral> = (...args: QueryFn<T>[]) => SelectQueryBuilder<T>

export function queryPipe<T extends ObjectLiteral>(repository: Repository<T>): QueryPipeFn<T> {
  return (...args) => {
    let query = repository.createQueryBuilder()
    for (const fn of args) {
      query = fn(query)
    }
    return query
  }
}

const asArray = <T>(value: T | T[]) => Array.isArray(value) ? [...value] : [value]

const condOrder = (value: string) => {
  if (/^\+/.test(value)) return 'ASC'
  if (/^-/.test(value)) return 'DESC'
  return 'ASC'
}

export function orderBy<T extends ObjectLiteral>(sorts?: string | string[]): QueryFn<T> {
  if (!sorts) {
    return (query) => query
  }
  const pipeData: [string, 'DESC' | 'ASC'][] = []
  for (const value of asArray(sorts)) {
    const order = condOrder(value)
    const field = value.replace(/^[-+]/, '')
    pipeData.push([field, order])
  }
  return (query) => {
    let newQuery = query
    for (const [field, order] of pipeData) {
      newQuery = newQuery.addOrderBy(field, order)
    }
    return newQuery
  }
}

const KeywordMatch = z.tuple([
  z.union([z.literal('like'), z.literal('equal')]),
  z.string(),
  z.union([z.string(), z.array(z.string())]),
])

export function searchBy<T extends ObjectLiteral>(mode: 'like' | 'equal', search: string, fields: string | string[]): QueryFn<T> {
  if (mode === 'equal') {
    return (query) => {
      const where: [string, string][] = []
      for (const [field, value] of Object.entries(fields)) {
        where.push([field, value])
      }
      if (where.length) {
        return query.andWhere(Object.fromEntries(where))
      }
      return query
    }
  }
  if (mode === 'like') {
    return (query) => {
      const where: [string, FindOperator<string>][] = []
      for (const field of asArray(fields)) {
        where.push([field, new FindOperator('like', `%${search}%`)])
      }
      if (search && where.length) {
        return query.andWhere(Object.fromEntries(where))
      }
      return query
    }
  }
  return (query) => query
}

export function filterBy<T extends ObjectLiteral>(fields?: string | string[]): QueryFn<T> {
  if (!fields) {
    return (query) => query
  }
  return (query) => {
    const selection = asArray(fields)
    if (selection.length) {
      return query.select(selection)
    }
    return query
  }
}


export function pageBy<T extends ObjectLiteral>(page?: number, pageSize?: number): QueryFn<T> {
  if (!page) {
    return (query) => query
  }
  if (!pageSize) {
    return (query) => query
  }
  return (query) => {
    return query.skip((page - 1) * pageSize).take(pageSize)
  }
}