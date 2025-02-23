import { Module } from '@nestjs/common'
import { CacheService } from './CacheService'
import { redisProvider } from './redis.provider'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

@Module({
  imports: [],
  providers: [redisProvider, CacheService],
  exports: [redisProvider, CacheService],
})
export class CacheModule {}
