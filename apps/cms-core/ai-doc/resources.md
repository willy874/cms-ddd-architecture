# Resource

## Pattern

### Define Resource Example

```ts
import { z } from 'zod'
import { GET_BASE_FETCHER_CONFIG } from '@/constants/query'
import { getCoreContext } from '@/libs/CoreContext'
import { createFetcher, defineRestResource } from '@/libs/http'

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
  const fetcher = createFetcher(resource,
    getCoreContext().queryBus.query(GET_BASE_FETCHER_CONFIG),
  )
  return fetcher({ body }).then((res) => res.data)
}
```

## API Schema

### Login

```ts
type LoginRequestDTO = {
  username: string
  password: string
}

type LoginResponseDTO = {
  tokenType: string
  accessToken: string
  refreshToken: string
}
```

### Register

```ts
type RegisterRequestDTO = {
  username: string
  password: string
}

type RegisterResponseDTO = void
```
