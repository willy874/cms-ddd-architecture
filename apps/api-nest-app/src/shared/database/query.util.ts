import { FindOperator, Like, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

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

export function orderBy<T extends ObjectLiteral>(sorts: string | string[] = []): QueryFn<T> {
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

export function searchBy<T extends ObjectLiteral>(fields: Record<string, string>): QueryFn<T> {
  return (query) => {
    const where: [string, FindOperator<string>][] = []
    for (const [field, value] of Object.entries(fields)) {
      where.push([field, Like(`%${value}%`)])
    }
    if (where.length) {
      return query.andWhere(Object.fromEntries(where))
    }
    return query
  }
}

export function likeSearchBy<T extends ObjectLiteral>(fields: string | string[], search?: string): QueryFn<T> {
  return (query) => {
    const where: [string, FindOperator<string>][] = []
    for (const field of asArray(fields)) {
      where.push([field, Like(`%${search}%`)])
    }
    if (search && where.length) {
      return query.andWhere(Object.fromEntries(where))
    }
    return query
  }
}

export function filterBy<T extends ObjectLiteral>(fields: string | string[] = []): QueryFn<T> {
  return (query) => {
    const selection = asArray(fields)
    if (selection.length) {
      return query.select(selection)
    }
    return query
  }
}
