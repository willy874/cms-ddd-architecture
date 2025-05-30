import { AppRoute } from '@ts-rest/core'
import { z } from 'zod'

export const test = {
  method: 'GET',
  path: '/apis/auth/test',
  query: z.record(z.unknown()).optional(),
  responses: {
    200: z.object({
      code: z.number(),
      data: z.object({
        message: z.string(),
      }),
    }),
  },
} as const satisfies AppRoute
