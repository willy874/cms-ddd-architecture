import { QueryParams } from '@/shared/types'
import { FindOperator, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

export type QueryFn<T extends ObjectLiteral> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>
export type QueryPipeFn<T extends ObjectLiteral> = (...args: QueryFn<T>[]) => SelectQueryBuilder<T>

export function createQueryPipe<T extends ObjectLiteral>(repository: Repository<T>): QueryPipeFn<T> {
  return (...args) => {
    let query = repository.createQueryBuilder()
    for (const fn of args) {
      query = fn(query)
    }
    return query
  }
}

const asArray = <T>(value?: T | T[]) => Array.isArray(value) ? [...value] : (value ? [value] : [])

const condOrder = (value: string) => {
  if (/^\+/.test(value)) return 'ASC'
  if (/^-/.test(value)) return 'DESC'
  return 'ASC'
}

export function orderBy<T extends ObjectLiteral>(sorts?: string | string[]): QueryFn<T> {
  if (!sorts) {
    return query => query
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

export function searchBy<T extends ObjectLiteral>(search?: string, fields?: string | string[]): QueryFn<T> {
  if (!search || !fields) {
    return query => query
  }
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

export function filterBy<T extends ObjectLiteral>(fields?: string | string[], exclude?: string | string[]): QueryFn<T> {
  if (!fields || !fields.length) {
    return query => query
  }
  return (query) => {
    let selection = asArray(fields)
    if (exclude && exclude.length) {
      selection = selection.filter(field => !asArray(exclude).includes(field))
    }
    if (selection.length) {
      return query.select(selection)
    }
    return query
  }
}

export function pageBy<T extends ObjectLiteral>(page?: number, pageSize?: number): QueryFn<T> {
  if (!page || !pageSize) {
    return query => query
  }
  return (query) => {
    return query.skip((page - 1) * pageSize).take(pageSize)
  }
}

export async function createSearchQuery<Entity extends ObjectLiteral>(repository: Repository<Entity>, params: QueryParams): Promise<[Entity[], number]> {
  const { page, pageSize, filter, exclude, search, sort } = params
  const queryPipe = createQueryPipe(repository)
  const result = await queryPipe(
    filterBy(filter, exclude),
    searchBy(search, this.fields),
    orderBy(sort),
    pageBy(page, pageSize),
  ).getManyAndCount()
  return result
}
