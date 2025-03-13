import Redis from 'ioredis'
import { getEnvironment } from '@packages/shared'
import { CacheRepository, ICacheRepository } from './cache.repository'

export const cacheFactory = () => {
  const { CACHE_HOST, CACHE_PORT } = getEnvironment()
  const redis = new Redis({
    host: CACHE_HOST,
    port: CACHE_PORT,
  })
  return new CacheRepository({
    get: async (key: string) => {
      return redis.get(key)
    },
    set: async (key: string, value: string, ttl?: number) => {
      if (typeof ttl === 'undefined') {
        return redis.set(key, value)
      }
      return redis.set(key, value, 'EX', ttl)
    },
    del: async (key: string) => {
      const oldValue = await redis.get(key)
      await redis.del(key)
      return !!oldValue
    },
  } satisfies ICacheRepository)
}
