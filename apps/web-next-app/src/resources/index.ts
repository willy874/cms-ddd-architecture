import { initClient } from '@ts-rest/core'
import { contract } from './common'
import { search } from './auth/search'
import { test } from './auth/test'
import { defaultOptions } from './contract'

export const authClient = initClient(
  contract.router({
    test,
    search,
  }),
  defaultOptions,
)
