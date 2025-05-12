import { WhereParams } from '@/shared/types'
import { and, asc, desc, ilike, sql } from 'drizzle-orm'
import type { Column, SQL } from 'drizzle-orm'
import { pipe } from 'rxjs'

type TableWithColumns = {
  [x: string]: Column<any, object, object>
}

export function searchBy(search: string | undefined, table: TableWithColumns) {
  return (whereClauses: SQL[]) => {
    const fields = Object.values(table)
    if (search && fields.length > 0) {
      const searchTerm = `%${search}%`
      const searchClause = fields.map(field => ilike(field, searchTerm))
      const sql = and(...searchClause)
      if (sql) {
        whereClauses.push(sql)
      }
    }
    return whereClauses
  }
}

export function filterBy(filter: string | string[] | undefined, table: TableWithColumns) {
  return (whereClauses: SQL[]) => {
    if (!filter) return whereClauses
    const filters = Array.isArray(filter) ? filter : [filter]
    for (const f of filters) {
      const [field, value] = f.split(':')
      if (field && value && table[field]) {
        whereClauses.push(ilike(table[field], `%${value}%`))
      }
    }
    return whereClauses
  }
}

export function excludeFilter(exclude: string | string[] | undefined, table: TableWithColumns) {
  return (whereClauses: SQL[]) => {
    if (!exclude) return whereClauses
    const excludes = Array.isArray(exclude) ? exclude : [exclude]
    for (const ex of excludes) {
      const [field, value] = ex.split(':')
      if (field && value && table[field]) {
        whereClauses.push(sql`${table[field]} != ${value}`)
      }
    }
    return whereClauses
  }
}

export function sortBy(sort: string | string[] | undefined, table: TableWithColumns) {
  return (whereClauses: SQL[]) => {
    if (!sort) return whereClauses
    const sorts = Array.isArray(sort) ? sort : [sort]
    for (const s of sorts) {
      if (s.startsWith('-')) {
        const field = s.slice(1)
        if (table[field]) whereClauses.push(desc(table[field]))
      }
      else {
        if (table[s]) whereClauses.push(asc(table[s]))
      }
    }
    return whereClauses
  }
}

export function createSearchQuery(tables: TableWithColumns): (params: WhereParams) => SQL | undefined {
  return (params) => {
    const { search, filter, exclude, sort } = params
    const fn: (p: SQL[]) => SQL[] = pipe(
      searchBy(search, tables),
      filterBy(filter, tables),
      excludeFilter(exclude, tables),
      sortBy(sort, tables),
    )
    const searchQuery = fn([])
    return searchQuery.length ? and(...searchQuery) : undefined
  }
}
