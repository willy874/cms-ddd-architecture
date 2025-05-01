import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

const AuthTestSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
})

const AuthTestByIdRequestDTOSchema = z.object({
  pathParams: z.object({
    id: z.string(),
  }),
  query: z.record(z.unknown()).optional(),
})

const AuthTestByIdResponseDTOSchema = z.object({
  code: z.number(),
  data: z.object({
    list: z.array(AuthTestSchema),
  }),
})

export const test = {
  method: 'GET',
  path: '/apis/auth/test/:id',
  pathParams: AuthTestByIdRequestDTOSchema.shape.pathParams,
  query: AuthTestByIdRequestDTOSchema.shape.query,
  responses: {
    200: AuthTestByIdResponseDTOSchema,
  },
} as const satisfies AppRoute
