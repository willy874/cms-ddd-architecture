import { CacheRepository } from '@/shared/cache'
import { setCurrentCache } from '@/shared/cache/cacheRef'
import { IRepository } from '@/shared/database/Repository'
import { setRepository } from '@/shared/database/repositoryMap'

jest.mock('@/shared/cache/cache.module', () => {
  const CACHE_PROVIDER = 'CACHE_PROVIDER'
  const cacheProvider = {
    provide: CACHE_PROVIDER,
    useFactory: () => {
      const cache = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
      } satisfies CacheRepository
      setCurrentCache(cache)
      return cache
    },
  }

  return {
    CACHE_PROVIDER,
    CacheModule: {
      module: class {},
      providers: [cacheProvider],
      exports: [cacheProvider],
    },
  }
})

jest.mock('@/shared/database/database.module', () => {
  const DATABASE_PROVIDER = 'DATABASE_PROVIDER'
  const databaseProvider = {
    provide: DATABASE_PROVIDER,
    useFactory: () => {
      return {
        getRepository: (entity) => {
          const repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          } as IRepository<any>
          setRepository(entity, repository)
          return repository
        },
      }
    },
  }

  return {
    DATABASE_PROVIDER,
    DatabaseModule: {
      module: class {},
      providers: [databaseProvider],
      exports: [databaseProvider],
    },
  }
})
