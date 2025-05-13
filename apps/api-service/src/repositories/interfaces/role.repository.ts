import { Permission, Role } from '@/models'
import { PickKey } from './utils'
import { QueryParams } from '@/shared/types'
import { CreateRoleDto } from '../dtos/create-role.dto'

export interface RoleDatabaseQueryDTO {
  id: Role['id']
  name: Role['name']
}

export abstract class IRoleRepository {
  abstract all(): Promise<Role[]>
  abstract findById(id: number): Promise<Role | null>
  abstract insert(role: CreateRoleDto): Promise<PickKey<Role, 'id'>>
  abstract create(role: CreateRoleDto): Promise<PickKey<Role, 'id'> & { permissions: Permission['name'][] }>
  abstract update(id: number, role: unknown): Promise<unknown>
  abstract delete(id: number): Promise<unknown>
  abstract searchQuery(params: QueryParams): Promise<[RoleDatabaseQueryDTO[], number]>
}
