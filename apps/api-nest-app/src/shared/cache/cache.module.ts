import { Module } from '@nestjs/common'
import { CacheService } from './cache.service'
import { redisProvider } from './redis.provider'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

@Module({
  providers: [redisProvider, CacheService],
  exports: [redisProvider, CacheService],
})
export class CacheModule {}
