import { GetProviderType } from '@/utils/types'
import { databaseProvider } from './database.provider'
export { INJECT_DATABASE } from './database.provider'
export { DatabaseModule } from './database.module'

export type Database = GetProviderType<typeof databaseProvider>
