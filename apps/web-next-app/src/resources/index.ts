import { initClient } from '@ts-rest/core'
import { contract, defaultOptions } from '@/shared/http'
import { search } from './auth/search'
import { test } from './auth/test'

export const authClient = initClient(
  contract.router({
    test,
    search,
  }),
  defaultOptions,
)
