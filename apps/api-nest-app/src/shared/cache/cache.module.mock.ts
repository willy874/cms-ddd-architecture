import { MockModule } from '@/utils/types'
import { CACHE_PROVIDER, cacheProvider, CacheRepository } from './cache.module'
import { Module } from '@nestjs/common'

export const createMockCacheModule = () => {
  const mockInstance: CacheRepository = {
    set: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
    get: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
    del: jest.fn(() => {
      throw new Error('Method not implemented.')
    }),
  }

  const provider: typeof cacheProvider = {
    provide: CACHE_PROVIDER,
    inject: [],
    useFactory: () => mockInstance,
  }

  @Module({
    providers: [provider],
    exports: [provider],
  })
  class MockCacheModule {}
  return {
    getMockInstance: (): MockModule<CacheRepository> => mockInstance as any,
    getModule: () => MockCacheModule,
  }
}
