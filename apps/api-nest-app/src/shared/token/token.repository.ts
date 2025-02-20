import { CACHE_PROVIDER, CacheRepository } from '../cache/cache.module'

export const TOKEN_CACHE_PROVIDER = 'TOKEN_CACHE_PROVIDER'

export const cacheProvider = {
  provide: TOKEN_CACHE_PROVIDER,
  inject: [CACHE_PROVIDER],
  useFactory: (cache: CacheRepository) => cache,
}
