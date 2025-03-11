export type CacheRepository = {
  set: (key: string, value: string, ttl?: number) => Promise<string>
  get: (key: string) => Promise<string | null>
  del: (key: string) => Promise<boolean>
}

export class CacheService {
  constructor(private cache: CacheRepository) {}

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
