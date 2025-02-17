import { Module } from '@nestjs/common'
import { REDIS_PROVIDER, RedisModule, RedisRepository } from './redis.module'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export type CacheRepository = {
  set: (key: string, value: string) => Promise<void>
  get: (key: string) => Promise<string | null>
  del: (key: string) => Promise<void>
}

export const cacheProvider = {
  provide: CACHE_PROVIDER,
  inject: [REDIS_PROVIDER],
  useFactory: (cache: RedisRepository): CacheRepository => {
    return {
      set: async (key, value) => {
        await cache.set(key, value)
      },
      get: async (key) => {
        return await cache.get(key)
      },
      del: async (key) => {
        await cache.del(key)
      },
    }
  },
}

@Module({
  imports: [RedisModule],
  providers: [cacheProvider],
  exports: [cacheProvider],
})
export class CacheModule {}
