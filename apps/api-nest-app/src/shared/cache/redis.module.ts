import { env } from '@/env'
import Redis from 'ioredis'
import { Module } from '@nestjs/common'

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

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
