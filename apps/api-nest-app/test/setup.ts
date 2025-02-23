import { setCurrentCache } from '@/shared/cache/cacheRef'
import { IRepository } from '@/shared/database/Repository'
import { setRepository } from '@/shared/database/repositoryMap'
import { Injectable } from '@nestjs/common'

jest.mock('@/shared/cache', () => {
  // const modules = jest.requireActual('@/shared/cache')

  @Injectable()
  class CacheService {
    constructor() {
      setCurrentCache(this as any)
    }

    get = jest.fn()
    set = jest.fn()
    del = jest.fn()
  }

  return {
    CacheModule: {
      module: class {},
      providers: [CacheService],
      exports: [CacheService],
    },
  }
})

jest.mock('@/shared/database', () => {
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
