import { Permission } from '@/models'
import { PickKey } from './utils'

export abstract class IPermissionRepository {
  abstract all(): Promise<Permission[]>
  abstract findById(id: number): Promise<Permission | null>
  abstract create(permission: unknown): Promise<PickKey<Permission, 'id'>>
  abstract update(id: number, permission: unknown): Promise<Permission>
  abstract delete(id: number): Promise<unknown>
}
