import { config } from 'dotenv';
import { z } from 'zod';

const EnvironmentSchema = z.object({
  GATEWAY_API_PREFIX: z.string().default('apis'),
  GATEWAY_API_HOST: z.string().default('localhost'),
  GATEWAY_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // auth service
  AUTH_API_PREFIX: z.string().default('apis/auth'),
  AUTH_API_HOST: z.string().default('localhost'),
  AUTH_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // user service
  USER_API_PREFIX: z.string().default('apis/user'),
  USER_API_HOST: z.string().default('localhost'),
  USER_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // cache service
  CACHE_HOST: z.string().default('localhost'),
  CACHE_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
})

export type Environments = z.infer<typeof EnvironmentSchema>;


export const initEnvironment = () => {
  config({ path: '.env' })
}

export function getEnvironment() {
  const result = EnvironmentSchema.safeParse(process.env)
  if (result.success) {
    return result.data;
  }
  throw result.error;
}