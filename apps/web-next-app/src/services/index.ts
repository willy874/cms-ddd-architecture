import { TEST_QUERY_KEY } from './auth/test'
import { SEARCH_QUERY_KEY } from './auth/search'

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: typeof TEST_QUERY_KEY | typeof SEARCH_QUERY_KEY
  }
}

export * from './auth/search'
export * from './auth/test'
