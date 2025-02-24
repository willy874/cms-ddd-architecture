import { ConfigType } from '@nestjs/config'
import cacheConfigProvider from '@/shared/config/cache'
import { cacheFactory } from './redis'

export const CACHE_PROVIDER = 'CACHE_PROVIDER'

export const CacheServiceProvider = {
  provide: CACHE_PROVIDER,
  inject: [cacheConfigProvider.KEY],
  useFactory: (config: ConfigType<typeof cacheConfigProvider>) => {
    return cacheFactory(config)
  },
}
