import Redis from 'ioredis'
import { ConfigType } from '@nestjs/config'
import { Module } from '@nestjs/common'
import cacheConfigProvider from '@/shared/config/cache'
import { CacheRepository, CacheService } from '../CacheRepository'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

const CacheServiceProvider = {
  provide: CACHE_PROVIDER,
  inject: [cacheConfigProvider.KEY],
  useFactory: (config: ConfigType<typeof cacheConfigProvider>) => {
    const cache = new Redis({
      host: config.host,
      port: config.port,
    })
    return new CacheService({
      get: async (key: string) => {
        return cache.get(key)
      },
      set: async (key: string, value: string, ttl?: number) => {
        if (typeof ttl === 'undefined') {
          return cache.set(key, value)
        }
        return cache.set(key, value, 'EX', ttl)
      },
      del: async (key: string) => {
        const oldValue = await cache.get(key)
        await cache.del(key)
        return !!oldValue
      },
    } satisfies CacheRepository)
  },
}

@Module({
  providers: [CacheServiceProvider],
  exports: [CacheServiceProvider],
})
export class CacheModule {}
