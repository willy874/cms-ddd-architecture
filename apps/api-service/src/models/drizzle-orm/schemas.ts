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

export const userRelations = relations(users, ({ many }) => ({
  roles: many(roles),
}))

export const userRoles = mysqlTable(
  'user_roles',
  {
    userId: int('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: int('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
)

// --- Permissions Table ---
export const permissions = mysqlTable('permissions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique().notNull(),
})

export const roleRelations = relations(roles, ({ many }) => ({
  permissions: many(permissions),
}))

export const rolePermissions = mysqlTable(
  'role_permissions',
  {
    roleId: int('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: int('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
)
