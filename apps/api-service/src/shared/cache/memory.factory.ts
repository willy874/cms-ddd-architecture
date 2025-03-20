import { createCache } from 'cache-manager'
import { CacheRepository, ICacheRepository } from './cache.repository'

export const cacheFactory = () => {
  const cache = createCache()
  return new CacheRepository({
    get: async (key: string) => {
      return cache.get(key)
    },
    set: async (key: string, value: string, ttl?: number) => {
      return cache.set(key, value, ttl)
    },
    del: async (key: string) => {
      return cache.del(key)
    },
  } satisfies ICacheRepository)
}
