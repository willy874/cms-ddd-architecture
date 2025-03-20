import { getEnvironment } from '@packages/shared'
import { cacheFactory as redisFactory } from './redis.factory'
import { cacheFactory as memoryFactory } from './memory.factory'
import { CacheRepository } from './cache.repository'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export const CacheServiceProvider = {
  provide: CACHE_PROVIDER,
  useFactory: () => {
    const { CACHE_MODE } = getEnvironment()
    const cacheSources: Record<string, () => CacheRepository> = {
      redis: () => redisFactory(),
      memory: () => memoryFactory(),
    }
    const cacheFactory = cacheSources[CACHE_MODE] || cacheSources.memory
    return cacheFactory()
  },
}
