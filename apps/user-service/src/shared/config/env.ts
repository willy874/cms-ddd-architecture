import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { config } from 'dotenv'

let env: Record<string, string | undefined> | null = null

export function loadEnv() {
  const output = config({ path: resolve(cwd(), '.env') })
  Object.assign(env, output.parsed, process.env)
  return output.parsed
}

export function getEnvironment() {
  if (!env) {
    throw new Error('Environment not loaded')
  }
  return {
    NODE_ENV: env.NODE_ENV,
    APP_PORT: parseInt(env.APP_PORT, 10),
    API_PREFIX: env.API_PREFIX,
    DATABASE_HOST: env.DATABASE_HOST,
    DATABASE_PORT: parseInt(env.DATABASE_PORT, 10),
    DATABASE_USER: env.DATABASE_USER,
    DATABASE_PASSWORD: env.DATABASE_PASSWORD,
    DATABASE_NAME: env.DATABASE_NAME,
    CACHE_MODE: env.CACHE_MODE,
    CACHE_HOST: env.CACHE_HOST,
    CACHE_PORT: parseInt(env.CACHE_PORT, 10),
    QUEUE_HOST: env.QUEUE_HOST,
    QUEUE_PORT: parseInt(env.QUEUE_PORT, 10),
    QUEUE_USER: env.QUEUE_USER,
    QUEUE_PASSWORD: env.QUEUE_PASSWORD,
    GATEWAY_API_PREFIX: env.GATEWAY_API_PREFIX,
    GATEWAY_API_HOST: env.GATEWAY_API_HOST,
    GATEWAY_API_PORT : parseInt(env.GATEWAY_API_PORT, 10),
    AUTH_API_PREFIX: env.AUTH_API_PREFIX,
    AUTH_API_HOST: env.AUTH_API_HOST,
    AUTH_API_PORT: parseInt(env.AUTH_API_PORT, 10),
    USER_API_PREFIX: env.USER_API_PREFIX,
    USER_API_HOST: env.USER_API_HOST,
    USER_API_PORT: parseInt(env.USER_API_PORT, 10),
  }
}
