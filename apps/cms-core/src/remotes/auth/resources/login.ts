import { z } from 'zod'
import { createFetcher, defineRestResource } from '@/libs/http'
import { getBaseFetcherConfig } from '@/remotes/auth/contexts/core'

const LoginRequestDTOSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const LoginResponseDTOSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
})

const resource = defineRestResource({
  url: '/auth/login',
  method: 'POST',
  body: LoginRequestDTOSchema,
  response: z.object({
    code: z.number(),
    message: z.string(),
    data: LoginResponseDTOSchema,
  }),
})

export const apiLogin = (body: z.infer<typeof LoginRequestDTOSchema>) => {
  const fetcher = createFetcher(resource, getBaseFetcherConfig())
  return fetcher({ body }).then((res) => res.data)
}
