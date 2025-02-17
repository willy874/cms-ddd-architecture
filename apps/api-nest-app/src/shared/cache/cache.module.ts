import { Module } from '@nestjs/common'
import { GetProviderType } from '@/utils/types'
import { redisProvider, REDIS_PROVIDER } from './redis.module'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'
export type CacheRepository = GetProviderType<typeof redisProvider>

export const cacheProvider = {
  provide: CACHE_PROVIDER,
  inject: [REDIS_PROVIDER],
  useFactory: async (cache: CacheRepository) => {
    return cache
  },
}

@Module({
  providers: [cacheProvider],
  exports: [cacheProvider],
})
export class CacheModule {}
