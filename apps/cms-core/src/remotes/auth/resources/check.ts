import { z } from 'zod'
import { createFetcher, defineRestResource } from '@/libs/http'
import { getAuthFetcherConfig } from '../contexts/core'

const resource = defineRestResource({
  url: '/auth/check',
  method: 'GET',
  response: z.object({
    code: z.number(),
    message: z.string(),
    data: z.object({}),
  }),
})

export const apiCheckLogin = () => {
  const fetcher = createFetcher(resource, getAuthFetcherConfig())
  return fetcher().then((res) => res.data)
}
