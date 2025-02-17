import { env } from '@/env'
import Redis from 'ioredis'
import { Module } from '@nestjs/common'
import { GetProviderType } from '@/utils/types'

export const REDIS_PROVIDER = 'REDIS_PROVIDER'

export const redisProvider = {
  provide: REDIS_PROVIDER,
  useFactory: async () => {
    return new Redis({
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT) || 6379,
    })
  },
}

export type RedisRepository = GetProviderType<typeof redisProvider>

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
