import { Inject } from '@nestjs/common'
import { CacheRepository } from './CacheRepository'
import { REDIS_PROVIDER, RedisRepository } from './redis.provider'

export class CacheService implements CacheRepository {
  constructor(@Inject(REDIS_PROVIDER) private readonly cacheManager: RedisRepository) {}

  get(key: string) {
    return this.cacheManager.get(key)
  }

  set(key: string, value: string, ttl?: number) {
    if (typeof ttl === 'undefined') {
      return this.cacheManager.set(key, value)
    }
    return this.cacheManager.set(key, value, 'EX', ttl)
  }

  async del(key: string) {
    const oldValue = await this.cacheManager.get(key)
    await this.cacheManager.del(key)
    return !!oldValue
  }
}
