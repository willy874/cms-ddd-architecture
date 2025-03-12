import { createCache } from 'cache-manager'
import { CacheRepository, CacheService } from './cache.repository'

export const cacheFactory = () => {
  const cache = createCache()
  return new CacheService({
    get: async (key: string) => {
      return cache.get(key)
    },
    set: async (key: string, value: string, ttl?: number) => {
      return cache.set(key, value, ttl)
    },
    del: async (key: string) => {
      return cache.del(key)
    },
  } satisfies CacheRepository)
}
