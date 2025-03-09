import { config } from 'dotenv';
import { z } from 'zod';

const EnvironmentSchema = z.object({
  GATEWAY_API_PREFIX: z.string().optional(),
  GATEWAY_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  GATEWAY_API_HOST: z.string().optional(),
  // auth service
  AUTH_API_PREFIX: z.string().optional(),
  AUTH_API_HOST: z.string().optional(),
  AUTH_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // user service
  USER_API_PREFIX: z.string().optional(),
  USER_API_HOST: z.string().optional(),
  USER_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // cache service
  CACHE_HOST: z.string().optional(),
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