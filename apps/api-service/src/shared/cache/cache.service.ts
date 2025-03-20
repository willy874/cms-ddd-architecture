import { Inject, Injectable } from '@nestjs/common'
import { CacheRepository } from './cache.repository'
import { CACHE_PROVIDER } from './cache.provider'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_PROVIDER) private cache: CacheRepository) {}

  set(key: string, value: string, ttl?: number): Promise<string> {
    return this.cache.set(key, value, ttl)
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key)
  }

  async del(key: string): Promise<boolean> {
    return this.cache.del(key)
  }
}
