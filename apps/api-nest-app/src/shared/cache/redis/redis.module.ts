import Redis from 'ioredis'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { GetProviderType } from '@/utils/types'
import cacheConfigProvider from '../../config/cache'

export const REDIS_PROVIDER = 'REDIS_PROVIDER'

export const redisProvider = {
  provide: REDIS_PROVIDER,
  inject: [cacheConfigProvider.KEY],
  useFactory: async (config: ConfigType<typeof cacheConfigProvider>) => {
    return new Redis({
      host: config.host,
      port: config.port,
    })
  },
}

export type RedisRepository = GetProviderType<typeof redisProvider>

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
