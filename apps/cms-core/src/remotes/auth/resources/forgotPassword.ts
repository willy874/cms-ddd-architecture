import { z } from 'zod'
import { createFetcher, defineRestResource } from '@/libs/http'
import { getBaseFetcherConfig } from '../contexts/core'

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
  const fetcher = createFetcher(resource, getBaseFetcherConfig())
  return fetcher({ body }).then(() => {})
}
