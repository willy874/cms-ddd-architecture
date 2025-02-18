import { join } from 'node:path'
import { cwd } from 'node:process'
import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { DeepPartial, GetProviderType } from '@/utils/types'

export const CONFIG_PROVIDER = 'CONFIG_PROVIDER'

const appConfig = {} as DeepPartial<{
  APP_PORT: number
  API_PREFIX: string
  DATABASE_HOST: string
  DATABASE_PORT: number
  DATABASE_USER: string
  DATABASE_PASSWORD: string
  DATABASE_NAME: string
  REDIS_HOST: string
  REDIS_PORT: number
}>

const isObject = (v: unknown): v is object => v && typeof v === 'object'

function deepMerge<T1 extends object, T2 extends object>(source1: T1, source2: T2): T1 & T2 {
  const result = {}
  for (const key in new Set([...Object.keys(source1), ...Object.keys(source2)])) {
    if (isObject(source1) && isObject(source2)) {
      result[key] = deepMerge(source1[key], source2[key])
      continue
    }
    if (isObject(source1) && key in source1) {
      result[key] = source1[key]
    }
    if (isObject(source2) && key in source2) {
      result[key] = source2[key]
    }
  }
  return result as any
}

const configProvider = {
  provide: CONFIG_PROVIDER,
  useFactory: () => appConfig,
}
export type ConfigProvider = GetProviderType<typeof configProvider>

@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigModule {
  register(cb: (p: typeof appConfig) => object) {
    const output = config({ path: join(cwd(), '.env') })
    Object.assign(appConfig, cb(deepMerge(appConfig, output.parsed)))
  }
}
