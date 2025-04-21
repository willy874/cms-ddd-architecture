import { GET_BASE_FETCHER_CONFIG, GET_AUTH_FETCHER_CONFIG } from '@/constants/query'
import { getCoreContext } from '@/libs/CoreContext'

export function getBaseFetcherConfig() {
  return getCoreContext().queryBus.query(GET_BASE_FETCHER_CONFIG)
}

export function getAuthFetcherConfig() {
  return getCoreContext().queryBus.query(GET_AUTH_FETCHER_CONFIG)
}
