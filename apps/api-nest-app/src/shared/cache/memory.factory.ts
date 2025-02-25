import { createCache } from 'cache-manager'
import { ConfigType } from '@nestjs/config'
import cacheConfigProvider from '@/shared/config/cache'
import { CacheRepository, CacheService } from './cache.repository'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cacheFactory = (_config: ConfigType<typeof cacheConfigProvider>) => {
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
