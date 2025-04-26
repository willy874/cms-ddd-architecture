import { Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DATABASE_PROVIDER, DatabaseRepository } from '@/shared/database/drizzle-orm'
import { Permission, permissionsTable } from '@/models/drizzle-orm'
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos'
import { IPermissionRepository } from '../interfaces'

export class PermissionRepository implements IPermissionRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {}

  async findByName(name: string): Promise<Permission | null> {
    const result = await this.db.query.permissions.findFirst({
      where: eq(permissionsTable.name, name),
    })
    return result || null
  }

  async findById(id: number): Promise<Permission | null> {
    const result = await this.db.query.permissions.findFirst({
      where: eq(permissionsTable.id, id),
    })
    return result || null
  }

  async all(): Promise<Permission[]> {
    return this.db
      .select()
      .from(permissionsTable)
  }

  async create(permission: CreatePermissionDto): Promise<Permission> {
    const newPermission = await this.db
      .insert(permissionsTable)
      .values(permission)
      .$returningId()

    return newPermission[0]
  }

  async update(id: number, permission: UpdatePermissionDto): Promise<Permission | null> {
    await this.db
      .update(permissionsTable)
      .set(permission)
      .where(eq(permissionsTable.id, id))
      .execute()

    return this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(permissionsTable)
      .where(eq(permissionsTable.id, id))
      .execute()
  }
}
