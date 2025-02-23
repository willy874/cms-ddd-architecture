import { CacheRepository } from './CacheRepository'
import { RedisRepository } from './redis/redis.module'

const redisFactory = (cache: RedisRepository): CacheRepository => {
  return {
    get: key => cache.get(key),
    set: async (key, value, ttl) => {
      if (typeof ttl === 'undefined') {
        return cache.set(key, value)
      }
      return cache.set(key, value, 'EX', ttl)
    },
    del: async (key) => {
      const oldValue = await cache.get(key)
      await cache.del(key)
      return !!oldValue
    },
  }
}

export const cacheFactory = redisFactory
