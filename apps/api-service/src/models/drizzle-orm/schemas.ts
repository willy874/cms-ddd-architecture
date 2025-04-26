import { mysqlTable, varchar, int } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
})

// --- Roles Table ---
export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const userRoles = mysqlTable('user_roles', {
  userId: int('user_id').notNull().references(() => users.id),
  roleId: int('role_id').notNull().references(() => roles.id),
})

// --- Permissions Table ---
export const permissions = mysqlTable('permissions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).unique(),
})

export const rolePermissions = mysqlTable('role_permissions', {
  roleId: int('role_id').notNull().references(() => roles.id),
  permissionId: int('permission_id').notNull().references(() => permissions.id),
})
