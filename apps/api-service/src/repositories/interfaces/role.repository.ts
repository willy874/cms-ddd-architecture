import { Role } from '@/models'
import { PickKey } from './utils'

export abstract class IRoleRepository {
  abstract all(): Promise<Role[]>
  abstract findById(id: number): Promise<Role | null>
  abstract create(role: unknown): Promise<PickKey<Role, 'id'>>
  abstract update(id: number, role: unknown): Promise<unknown>
  abstract delete(id: number): Promise<unknown>
}
