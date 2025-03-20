import { Module } from '@nestjs/common'
import { CacheServiceProvider } from './cache.provider'
import { CacheService } from './cache.service'

@Module({
  providers: [CacheServiceProvider, CacheService],
  exports: [CacheServiceProvider, CacheService],
})
export class CacheModule {}
