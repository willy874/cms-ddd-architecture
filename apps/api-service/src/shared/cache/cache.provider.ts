import { getEnvironment } from '@packages/shared'
import { ICacheRepository } from './cache.repository'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export const CacheServiceProvider = {
  provide: CACHE_PROVIDER,
  useFactory: async () => {
    const { CACHE_MODE } = getEnvironment()
    const cacheSources: Record<string, () => Promise<{ default: () => ICacheRepository }>> = {
      redis: () => import('./redis.factory'),
      memory: () => import('./memory.factory'),
    }
    const cacheFactory = cacheSources[CACHE_MODE] || cacheSources.memory
    const module = await cacheFactory()
    return module.default()
  },
}
