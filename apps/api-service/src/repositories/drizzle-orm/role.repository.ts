import { IRoleRepository } from '../interfaces'
import { Role } from '@/models'
import { Inject } from '@nestjs/common'
import { createSearchQuery, DATABASE_PROVIDER, DatabaseRepository } from '@/shared/database/drizzle-orm'
import { CreateRoleDto, UpdateRoleDto } from '../dtos'
import { Permission, permissionsTable, rolesTable } from '@/models/drizzle-orm'
import { rolePermissions } from '@/models/drizzle-orm/schemas'
import { eq, sql } from 'drizzle-orm'
import { PickKey } from '../interfaces/utils'
import { QueryParams } from '@/shared/types'
import { RoleDatabaseQueryDTO } from '../interfaces/role.repository'

export class RoleRepository implements IRoleRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {}

  async findIdByName(name: string[]): Promise<Permission[]> {
    const results = await this.db
      .select()
      .from(permissionsTable)
      .where(
        sql`${permissionsTable.name} IN (${sql.join(name, ', ')})`,
      )
    return results
  }

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

  async insert(payload: CreateRoleDto): Promise<PickKey<Role, 'id'>> {
    const [newRole] = await this.db
      .insert(rolesTable)
      .values(payload)
      .$returningId()
    return newRole
  }

  async create(role: CreateRoleDto): Promise<PickKey<Role, 'id'> & { permissions: Permission['name'][] }> {
    const permissions = await this.findIdByName(role.permissions)
    const notMatchedPermissions = permissions.filter(permission => !role.permissions.includes(permission.name))
    if (notMatchedPermissions.length) {
      throw new Error(`Permissions ${notMatchedPermissions.map(permission => permission.name).join(', ')} is not found.`)
    }
    const { id: roleId } = await this.insert(role)
    if (!roleId) {
      throw new Error(`Role with id ${roleId} not found`)
    }
    await this.db
      .insert(rolePermissions)
      .values(permissions.map(permission => permission.id!).map(id => ({ roleId, permissionId: id })))
      .execute()
    const permissionResults = await this.getRolePermissions([roleId])
    return {
      id: roleId,
      permissions: permissionResults.map(permission => permission.name),
    }
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

  async getRolePermissions(roleId: number[]): Promise<Permission[]> {
    const permissions = await this.db
      .select()
      .from(rolePermissions)
      .innerJoin(permissionsTable, eq(rolePermissions.permissionId, permissionsTable.id))
      .where(
        sql`${rolePermissions.roleId} IN (${sql.join(roleId, ', ')})`,
      )
    return permissions.map(item => item.permissions)
  }
}
