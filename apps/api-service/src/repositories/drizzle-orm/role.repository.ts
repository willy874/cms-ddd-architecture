import { IRoleRepository } from '../interfaces'
import { Role } from '@/models'
import { Inject } from '@nestjs/common'
import { createSearchQuery, DATABASE_PROVIDER, DatabaseRepository } from '@/shared/database/drizzle-orm'
import { CreateRoleDto, UpdateRoleDto } from '../dtos'
import { rolesTable } from '@/models/drizzle-orm'
import { eq, sql } from 'drizzle-orm'
import { PickKey } from '../interfaces/utils'
import { QueryParams } from '@/shared/types'
import { RoleDatabaseQueryDTO } from '../interfaces/role.repository'

export class RoleRepository implements IRoleRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {}

  async findByName(name: string): Promise<Role | null> {
    const [result] = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.name, name))
    return result || null
  }

  async findById(id: number): Promise<Role | null> {
    const [result] = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, id))
    return result || null
  }

  async all(): Promise<Role[]> {
    return this.db.select().from(rolesTable)
  }

  async create(payload: CreateRoleDto): Promise<PickKey<Role, 'id'>> {
    const [newRole] = await this.db
      .insert(rolesTable)
      .values(payload)
      .$returningId()
    return newRole
  }

  async update(id: number, role: UpdateRoleDto): Promise<Role | null> {
    await this.db
      .update(rolesTable)
      .set(role)
      .where(eq(rolesTable.id, id))
      .execute()

    return this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(rolesTable)
      .where(eq(rolesTable.id, id))
      .execute()
  }

  async searchQuery(params: QueryParams): Promise<[RoleDatabaseQueryDTO[], number]> {
    const {
      page = 1,
      pageSize = 10,
    } = params
    const tables = {
      id: rolesTable.id,
      name: rolesTable.name,
    }
    const createWhere = createSearchQuery(tables)
    const where = createWhere(params)
    const [data, total] = await Promise.all([
      this.db.select(tables)
        .from(rolesTable)
        .where(where)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(rolesTable)
        .where(where),
    ])

    return [data, total[0]?.count ?? 0]
  }
}
