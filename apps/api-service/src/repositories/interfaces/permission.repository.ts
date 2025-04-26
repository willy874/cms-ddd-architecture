import { Permission } from '@/models'

export abstract class IPermissionRepository {
  abstract all(): Promise<Permission[]>
  abstract findById(id: number): Promise<Permission | null>
  abstract create(permission: unknown): Promise<unknown>
  abstract update(id: number, permission: unknown): Promise<unknown>
  abstract delete(id: number): Promise<unknown>
}
