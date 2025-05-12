import { Permission } from '@/models'
import { PickKey } from './utils'
import { QueryParams } from '@/shared/types'

export interface PermissionDatabaseQueryDTO {
  id: Permission['id']
  name: Permission['name']
}

export abstract class IPermissionRepository {
  abstract all(): Promise<Permission[]>
  abstract findById(id: number): Promise<Permission | null>
  abstract create(permission: unknown): Promise<PickKey<Permission, 'id'>>
  abstract update(id: number, permission: unknown): Promise<Permission>
  abstract delete(id: number): Promise<unknown>
  abstract searchQuery(params: QueryParams): Promise<[PermissionDatabaseQueryDTO[], number]>
}
