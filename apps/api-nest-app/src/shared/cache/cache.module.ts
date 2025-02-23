import { Module } from '@nestjs/common'
import { REDIS_PROVIDER, RedisModule } from './redis/redis.module'
import { cacheFactory } from './cache.provider'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export const cacheProvider = {
  provide: CACHE_PROVIDER,
  inject: [REDIS_PROVIDER],
  useFactory: cacheFactory,
}

@Module({
  imports: [RedisModule],
  providers: [cacheProvider],
  exports: [cacheProvider],
})
export class CacheModule {}
