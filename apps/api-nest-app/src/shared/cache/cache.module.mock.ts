import { Module } from '@nestjs/common'
import { CACHE_PROVIDER, cacheProvider } from './cache.module'

const mockCacheProvider: typeof cacheProvider = {
  provide: CACHE_PROVIDER,
  inject: [],
  useFactory: () => {
    return {
      set: async (key, value) => {
        console.log(`Mock set: ${key} ${value}`)
      },
      get: async (key) => {
        console.log(`Mock get: ${key}`)
        return null
      },
      del: async (key) => {
        console.log(`Mock del: ${key}`)
      },
    }
  },
}
@Module({
  imports: [],
  providers: [mockCacheProvider],
  exports: [mockCacheProvider],
})
export class MockCacheModule {}
