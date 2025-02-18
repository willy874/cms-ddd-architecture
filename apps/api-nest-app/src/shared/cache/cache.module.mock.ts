import { MockModule } from '@/utils/types'
import { CACHE_PROVIDER, cacheProvider, CacheRepository } from './cache.module'
import { Module } from '@nestjs/common'

export const createMockCacheModule = () => {
  const mockInstance = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  } satisfies CacheRepository

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
    getMockInstance: (): MockModule<CacheRepository> => mockInstance,
    getModule: () => MockCacheModule,
  }
}
