import { ConfigType } from '@nestjs/config'
import cacheConfigProvider from '@/shared/config/cache'
import { cacheFactory as redisFactory } from './redis.factory'
import { cacheFactory as memoryFactory } from './memory.factory'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export const CacheServiceProvider = {
  provide: CACHE_PROVIDER,
  inject: [cacheConfigProvider.KEY],
  useFactory: (config: ConfigType<typeof cacheConfigProvider>) => {
    const cacheSources = {
      redis: () => redisFactory(config),
      memory: () => memoryFactory(config),
    }
    const cacheFactory = cacheSources[config.cacheMode] || cacheSources.memory
    return cacheFactory(config)
  },
}
