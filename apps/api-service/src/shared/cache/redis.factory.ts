import Redis, { RedisOptions } from 'ioredis'
import { getEnvironment } from '@packages/shared'
import { ICacheRepository } from './cache.repository'

class RedisCache implements ICacheRepository {
  private cache: Redis

  constructor(options: RedisOptions) {
    this.cache = new Redis(options)
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (typeof ttl === 'undefined') {
      return this.cache.set(key, value)
    }
    return this.cache.set(key, value, 'EX', ttl)
  }

  async del(key: string): Promise<boolean> {
    const oldValue = await this.cache.get(key)
    await this.cache.del(key)
    return !!oldValue
  }
}

const cacheFactory = (): ICacheRepository => {
  const { CACHE_HOST, CACHE_PORT } = getEnvironment()
  return new RedisCache({
    host: CACHE_HOST,
    port: CACHE_PORT,
  })
}

export default cacheFactory
