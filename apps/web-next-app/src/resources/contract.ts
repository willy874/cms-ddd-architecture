import { contract, restApi } from './common'
import { initClient, InitClientArgs } from '@ts-rest/core'
import { test } from './auth/test'
import { search } from './auth/search'

const defaultOptions = {
  baseUrl: '',
  api: restApi,
  validateResponse: true,
} as const satisfies InitClientArgs

export const authClient = initClient(
  contract.router({
    test,
    search,
  }),
  defaultOptions,
)
