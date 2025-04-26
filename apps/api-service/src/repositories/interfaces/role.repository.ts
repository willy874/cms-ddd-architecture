import { Role } from '@/models'

export abstract class IRoleRepository {
  abstract all(): Promise<Role[]>
  abstract findById(id: number): Promise<Role | null>
  abstract create(role: unknown): Promise<unknown>
  abstract update(id: number, role: unknown): Promise<unknown>
  abstract delete(id: number): Promise<unknown>
}
