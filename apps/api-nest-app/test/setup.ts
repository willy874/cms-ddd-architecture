import type { EntityTarget, IRepository } from '@/shared/database/Repository'

jest.mock('@/shared/cache', () => {
  const cacheModule = jest.requireActual<typeof import('@/shared/cache')>('@/shared/cache')
  const { CACHE_PROVIDER, setCurrentCache } = cacheModule
  const cacheManagerModule = jest.requireActual<typeof import('cache-manager')>('cache-manager')
  const cacheManager = cacheManagerModule.createCache()
  const CacheServiceProvider = {
    provide: CACHE_PROVIDER,
    useFactory: () => {
      cacheManager.get = jest.fn()
      cacheManager.set = jest.fn()
      cacheManager.del = jest.fn()
      setCurrentCache(cacheManager as any)
      return cacheManager
    },
  }
  return {
    ...cacheModule,
    CacheModule: {
      module: class {},
      providers: [CacheServiceProvider],
      exports: [CacheServiceProvider],
    },
  }
})

jest.mock('@/shared/database', () => {
  const databaseModule = jest.requireActual('@/shared/database')

  const setRepository = databaseModule.setRepository
  const DATABASE_PROVIDER = databaseModule.DATABASE_PROVIDER
  class MockRepository<T> implements IRepository<T> {
    constructor(private entity: EntityTarget<T>) {
      setRepository(entity, this)
    }

    find = jest.fn()
    findOne = jest.fn()
    save = jest.fn()
    findAndCount = jest.fn()
    update = jest.fn()
    delete = jest.fn()
  }

  const databaseProvider = {
    provide: DATABASE_PROVIDER,
    useFactory: () => {
      return {
        getRepository: (entity) => {
          return new MockRepository(entity)
        },
      }
    },
  }

  return {
    ...databaseModule,
    DatabaseModule: {
      module: class {},
      providers: [databaseProvider],
      exports: [databaseProvider],
    },
  }
})
