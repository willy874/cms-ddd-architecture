// import { CacheModule } from '@nestjs/cache-manager'
// import { Cache } from 'cache-manager'

export type CacheRepository = {
  set: (key: string, value: string, ttl?: number) => Promise<string>
  get: (key: string) => Promise<string | null>
  del: (key: string) => Promise<boolean>
}
