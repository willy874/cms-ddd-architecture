import { z } from 'zod'
import { createFetcher, defineRestResource } from '@/libs/http'
import { getBaseFetcherConfig } from '@/remotes/auth/contexts/core'

export const RegisterRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const resource = defineRestResource({
  url: '/auth/register',
  method: 'POST',
  body: RegisterRequestDTOSchema,
  response: z.object({
    code: z.number(),
    message: z.string(),
    data: RegisterRequestDTOSchema,
  }),
})

export const apiRegister = (body: z.infer<typeof RegisterRequestDTOSchema>) => {
  const fetcher = createFetcher(resource, getBaseFetcherConfig())
  return fetcher({ body }).then((res) => res.data)
}
