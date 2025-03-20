import { Permission } from '@/entities/permission.entity'
import { GetProviderType } from '../types'
import { Database } from './Database'
import { DATABASE_PROVIDER } from './database.provider'

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY'

export const PermissionRepositoryProvider = {
  provide: PERMISSION_REPOSITORY,
  inject: [DATABASE_PROVIDER],
  useFactory: (database: Database) => {
    return database.createRepository(Permission)
  },
}

export type PermissionRepository = GetProviderType<typeof PermissionRepositoryProvider>
