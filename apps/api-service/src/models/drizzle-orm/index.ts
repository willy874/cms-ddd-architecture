import * as schemas from './schemas'
import {
  users,
  roles,
  permissions,
  userRoles,
  rolePermissions,
} from './schemas'

export { schemas }

export const usersTable = schemas.users
export type User = typeof users.$inferInsert

export const rolesTable = schemas.roles
export type Role = typeof roles.$inferInsert

export const permissionsTable = schemas.permissions
export type Permission = typeof permissions.$inferInsert

export const userRolesTable = schemas.userRoles
export type UserRole = typeof userRoles.$inferInsert

export const rolePermissionsTable = schemas.rolePermissions
export type RolePermission = typeof rolePermissions.$inferInsert
