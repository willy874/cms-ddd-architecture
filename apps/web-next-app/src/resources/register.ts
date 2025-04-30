import { SEARCH_QUERY_KEY } from '../services/search'
import { TEST_QUERY_KEY } from '../services/test'

declare module '@tanstack/react-query' {
  interface Register {
    queryKey: typeof TEST_QUERY_KEY | typeof SEARCH_QUERY_KEY
  }
}

export {}
