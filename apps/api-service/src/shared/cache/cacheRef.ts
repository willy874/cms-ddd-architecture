import { CacheService } from './cache.service'

const cacheRef: { current: CacheService | null } = { current: null }
export function getCurrentCache(): CacheService {
  if (cacheRef.current) {
    return cacheRef.current
  }
  throw new Error('Repository not found')
}

export function setCurrentCache(cache: CacheService) {
  if (!cacheRef.current) {
    cacheRef.current = cache
  }
  else {
    throw new Error('Repository already exists')
  }
}
