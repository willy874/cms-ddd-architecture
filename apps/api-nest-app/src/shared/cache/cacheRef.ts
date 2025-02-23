import type { CacheRepository } from './CacheRepository'

const cacheRef: { current: CacheRepository } = { current: null }
export function getCurrentCache(): CacheRepository {
  if (cacheRef.current) {
    return cacheRef.current
  }
  throw new Error('Repository not found')
}

export function setCurrentCache(cache: CacheRepository) {
  if (!cacheRef.current) {
    cacheRef.current = cache
  }
  else {
    throw new Error('Repository already exists')
  }
}
