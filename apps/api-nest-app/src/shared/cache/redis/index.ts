import Redis from 'ioredis'
import { ConfigType } from '@nestjs/config'
import cacheConfigProvider from '@/shared/config/cache'
import { CacheRepository, CacheService } from '../cache.repository'

export const cacheFactory = (config: ConfigType<typeof cacheConfigProvider>) => {
  const redis = new Redis({
    host: config.host,
    port: config.port,
  })
  return new CacheService({
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
  } satisfies CacheRepository)
}
