import { Module } from '@nestjs/common'
import { CacheServiceProvider } from './cache.provider'

@Module({
  providers: [CacheServiceProvider],
  exports: [CacheServiceProvider],
})
export class CacheModule {}
