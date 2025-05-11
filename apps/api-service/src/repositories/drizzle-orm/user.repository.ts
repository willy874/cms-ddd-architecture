import { Inject, Injectable } from '@nestjs/common'
import { and, eq, sql } from 'drizzle-orm'
import { QueryPageResult, QueryParams } from '@/shared/types'
import { DATABASE_PROVIDER, DatabaseRepository, createSearchQuery } from '@/shared/database/drizzle-orm'
import { rolesTable, usersTable } from '@/models/drizzle-orm'
import { UpdateUserDto, CreateUserDto } from '../dtos'
import { IUserRepository } from '../interfaces'
import { UserDatabaseQueryDTO } from '../interfaces/user.repository'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {}

  private async getRolesByNames(names?: string[]) {
    if (!names) {
      return []
    }
    if (names.length === 0) {
      return []
    }
    const roles = await this.db.select().from(rolesTable).where(
      and(
        eq(rolesTable.name, names[0]),
      )
    )
    return roles
  }

  async getUserByNameAndPassword(dto: { username: string, password: string }) {
    const [user] = await this.db.select().from(usersTable).where(
      and(
        eq(usersTable.username, dto.username),
        eq(usersTable.password, dto.password),
      )
    )
    return user || null
  }

  async getUserByName(username: string) {
    const [user] = await this.db.select().from(usersTable).where(
      and(eq(usersTable.username, username))
    )
    return user || null
  }

  async getUserById(id: number) {
    const [user] = await this.db.select().from(usersTable).where(eq(usersTable.id, id))
    return user || null
  }

  async pageQuery(params: QueryParams): Promise<QueryPageResult> {
    const [list, total] = await this.searchQuery(params)
    return {
      list,
      total,
      page: 1,
      pageSize: 10,
    }
  }

  async insertUser(payload: CreateUserDto) {
    const [user] = await this.db.insert(usersTable).values(payload).$returningId()
    return user
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    await this.db.update(usersTable).set(payload).where(eq(usersTable.id, id))
    return this.getUserById(id)
  }

  async deleteUser(id: number) {
    return this.db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async searchQuery(params: QueryParams): Promise<[UserDatabaseQueryDTO[], number]> {
    const {
      page = 1,
      pageSize = 10,
    } = params
    const createWhere = createSearchQuery({
      id: usersTable.id,
      username: usersTable.username,
      password: usersTable.password,
    })
    const where = createWhere(params)
    const [data, total] = await Promise.all([
      this.db.select({
        id: usersTable.id,
        username: usersTable.username,
      }).from(usersTable)
        .where(where)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(usersTable)
        .where(where),
    ])

    return [data, total[0]?.count ?? 0]
  }
}
