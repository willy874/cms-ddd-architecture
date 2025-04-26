import { Inject, Injectable } from '@nestjs/common'
import { and, eq, sql } from 'drizzle-orm'
import { QueryPageResult, QueryParams } from '@/shared/types'
import { DATABASE_PROVIDER, DatabaseRepository, createSearchQuery } from '@/shared/database/drizzle-orm'
import { rolesTable, userRolesTable, usersTable } from '@/models/drizzle-orm'
import { UpdateUserDto, CreateUserDto } from '../dtos'
import { IUserRepository } from '../interfaces'

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
    const roles = await this.db.query.roles.findMany({
      where: and(...names.map(name => eq(rolesTable.name, name))),
    })
    return roles
  }

  async getUserByNameAndPassword(dto: { username: string, password: string }) {
    const user = await this.db.query.users.findFirst({
      where: and(eq(usersTable.username, dto.username), eq(usersTable.password, dto.password)),
    })
    return user || null
  }

  async getUserByName(username: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(usersTable.username, username),
    })
    return user || null
  }

  async getUserById(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(usersTable.id, id),
      with: {
        roles: {
          with: {
            role: true,
          },
        },
      },
    })
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
    const { roles: roleNames, ...rest } = payload
    const roles = await this.getRolesByNames(roleNames)

    const [user] = await this.db.insert(usersTable).values(rest).$returningId()

    if (roles.length) {
      await this.db.insert(userRolesTable).values(
        roles.map(role => ({
          userId: user.id,
          roleId: role.id,
        }))
      )
    }

    return user
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const roles = await this.getRolesByNames(roleNames)

    await this.db.update(usersTable).set(rest).where(eq(usersTable.id, id))

    await this.db.delete(userRolesTable).where(eq(userRolesTable.userId, id))

    if (roles.length) {
      await this.db.insert(userRolesTable).values(
        roles.map(role => ({
          userId: id,
          roleId: role.id,
        }))
      )
    }

    return this.getUserById(id)
  }

  async deleteUser(id: number) {
    await this.db.delete(userRolesTable).where(eq(userRolesTable.userId, id))
    return this.db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async searchQuery(params: QueryParams): Promise<[typeof usersTable.$inferSelect[], number]> {
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
      this.db.query.users.findMany({
        where: where,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(usersTable)
        .where(where),
    ])

    return [data, total[0]?.count ?? 0]
  }
}
