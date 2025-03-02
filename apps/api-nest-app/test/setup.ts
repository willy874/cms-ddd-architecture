// import { Observable } from 'rxjs'

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
  type ObjectLiteral = import('@/shared/database').ObjectLiteral
  type IRepository = import('@/shared/database').IRepository<ObjectLiteral>
  type EntityTarget = import('@/shared/database').EntityTarget<ObjectLiteral>
  const databaseModule = jest.requireActual<typeof import('@/shared/database')>('@/shared/database')
  const { setRepository, DATABASE_PROVIDER } = databaseModule
  const DatabaseProvider = {
    provide: DATABASE_PROVIDER,
    useFactory: () => {
      return {
        getRepository: (entity: EntityTarget) => {
          const instance = {
            find: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            insert: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            queryPage: jest.fn(),
          } satisfies IRepository
          setRepository(entity, instance)
          return instance
        },
      }
    },
  }
  return {
    ...databaseModule,
    DatabaseModule: {
      module: class {},
      providers: [DatabaseProvider],
      exports: [DatabaseProvider],
    },
  }
})

jest.mock('@/shared/queue', () => {
  const queueModule = jest.requireActual<typeof import('@/shared/queue')>('@/shared/queue')
  const queueProvider = {
    provide: queueModule.MESSAGE_SERVICE,
    useValue: {
      connect: jest.fn(),
      send: jest.fn(),
      emit: jest.fn(),
    },
  }
  class MessageQueueProducer {
    publish: jest.Mock
  }
  MessageQueueProducer.prototype.publish = jest.fn()
  return {
    ...queueModule,
    MessageQueueProducer,
    MessageQueueModule: {
      module: class {},
      providers: [queueProvider],
      exports: [queueProvider],
    },
  }
})
