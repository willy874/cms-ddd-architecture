import { IRoleRepository } from '../interfaces'
import { Role } from '@/models'
import { Inject } from '@nestjs/common'
import { DATABASE_PROVIDER, DatabaseRepository } from '@/shared/database/drizzle-orm'
import { CreateRoleDto, UpdateRoleDto } from '../dtos'
import { rolesTable } from '@/models/drizzle-orm'
import { eq } from 'drizzle-orm'

export class RoleRepository implements IRoleRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {}

  async findByName(name: string): Promise<Role | null> {
    const result = await this.db.query.roles.findFirst({
      where: eq(rolesTable.name, name),
    })
    return result || null
  }

  async findById(id: number): Promise<Role | null> {
    const result = await this.db.query.roles.findFirst({
      where: eq(rolesTable.id, id),
    })
    return result || null
  }

  async all(): Promise<Role[]> {
    return this.db.select().from(rolesTable)
  }

  async create(payload: CreateRoleDto): Promise<Role | null> {
    // const [user] = await this.db.insert(usersTable).values(rest).$returningId()
    const [role] = await this.db
      .insert(rolesTable)
      .values(payload)
      .$returningId()

    return role
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
}
