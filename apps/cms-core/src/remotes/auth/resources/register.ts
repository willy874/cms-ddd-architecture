import { z } from 'zod'
import { GET_AUTH_FETCHER_CONFIG } from '@/constants/query'
import { getCoreContext } from '@/libs/CoreContext'
import { createFetcher, defineRestResource } from '@/libs/http'

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
  const fetcher = createFetcher(resource,
    getCoreContext().queryBus.query(GET_AUTH_FETCHER_CONFIG),
  )
  return fetcher({ body }).then((res) => res.data)
}
