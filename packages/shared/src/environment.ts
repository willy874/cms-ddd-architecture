import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { config } from 'dotenv'
import { z } from 'zod'

const EnvironmentSchema = z.object({
  NODE_ENV: z.string().default('development'),
  APP_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  API_PREFIX: z.string().default('apis'),
  // database service
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  DATABASE_USER: z.string().default('root'),
  DATABASE_PASSWORD: z.string().default('root'),
  DATABASE_NAME: z.string().default('test'),
  // queue service
  QUEUE_HOST: z.string().default('localhost'),
  QUEUE_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  QUEUE_USER: z.string().default('guest'),
  QUEUE_PASSWORD: z.string().default('guest'),
  // cache service
  CACHE_MODE: z.string().default('memory'),
  CACHE_HOST: z.string().default('localhost'),
  CACHE_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // gateway service
  GATEWAY_API_PREFIX: z.string().default('apis'),
  GATEWAY_API_HOST: z.string().default('localhost'),
  GATEWAY_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // auth service
  AUTH_API_PREFIX: z.string().default('apis/auth'),
  AUTH_API_HOST: z.string().default('localhost'),
  AUTH_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // user service
  USER_API_PREFIX: z.string().default('apis/users'),
  USER_API_HOST: z.string().default('localhost'),
  USER_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // role service
  ROLE_API_PREFIX: z.string().default('apis/roles'),
  ROLE_API_HOST: z.string().default('localhost'),
  ROLE_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
  // permission service
  PERMISSION_API_PREFIX: z.string().default('apis/permissions'),
  PERMISSION_API_HOST: z.string().default('localhost'),
  PERMISSION_API_PORT: z.string().transform((v) => parseInt(v, 10)).optional(),
})

let env: Record<string, string | undefined> | null = null

export function loadEnv() {
  if (env) {
    return env
  }
  const output = config({ path: resolve(cwd(), '.env') })
  env = Object.assign({}, output.parsed, process.env)
  return output.parsed
}

export function getEnvironment() {
  if (!env) {
    throw new Error('Environment not loaded')
  }
  return EnvironmentSchema.parse(env)
}
