import { relations } from 'drizzle-orm'
import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
})

// --- Roles Table ---
export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
})

export const userRoleRelations = relations(users, ({ many }) => ({
  roles: many(roles),
}))

// --- Permissions Table ---
export const permissions = mysqlTable('permissions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
})

export const rolePermissionRelations = relations(roles, ({ many }) => ({
  permissions: many(permissions),
}))
