import { z } from 'zod'
import { GET_AUTH_FETCHER_CONFIG } from '@/constants/query'
import { getCoreContext } from '@/libs/CoreContext'
import { createFetcher, defineRestResource } from '@/libs/http'

const ForgotPasswordRequestDTOSchema = z.object({
  email: z.string(),
})

const resource = defineRestResource({
  url: '/auth/forgot-password',
  method: 'POST',
  body: ForgotPasswordRequestDTOSchema,
  response: z.object({
    code: z.number(),
    message: z.string(),
  }),
})

export const apiForgotPassword = (body: z.infer<typeof ForgotPasswordRequestDTOSchema>) => {
  const fetcher = createFetcher(resource,
    getCoreContext().queryBus.query(GET_AUTH_FETCHER_CONFIG),
  )
  return fetcher({ body }).then(() => {})
}
