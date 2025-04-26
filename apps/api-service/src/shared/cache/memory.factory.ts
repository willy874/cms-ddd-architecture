import { createCache } from 'cache-manager'
import { ICacheRepository } from './cache.repository'

class MemoryCache implements ICacheRepository {
  private cache = createCache()

  constructor() {
    this.cache = createCache()
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    return this.cache.set(key, value, ttl)
  }

  async del(key: string): Promise<boolean> {
    const oldValue = await this.cache.get(key)
    await this.cache.del(key)
    return !!oldValue
  }
}

const cacheFactory = (): ICacheRepository => {
  return new MemoryCache()
}

export default cacheFactory
