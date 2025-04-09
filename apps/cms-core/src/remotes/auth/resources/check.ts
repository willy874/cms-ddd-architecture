import { z } from 'zod'
import { GET_AUTH_FETCHER_CONFIG } from '@/constants/query'
import { getCoreContext } from '@/libs/CoreContext'
import { createFetcher, defineRestResource } from '@/libs/http'

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
  const fetcher = createFetcher(resource,
    getCoreContext().queryBus.query(GET_AUTH_FETCHER_CONFIG),
  )
  return fetcher({}).then((res) => res.data)
}
