import { getCoreContext } from '@/libs/CoreContext'

const STORE_PERMISSIONS = 'permissions'

type Permissions = Map<string, Permissions | Set<string>>

export function setPermissions(permissions: Permissions) {
  const ctx = getCoreContext()
  ctx.store.set(STORE_PERMISSIONS, permissions)
}

export function canAuth(permission: string) {
  const ctx = getCoreContext()
  if (ctx.config.isAuthClose) {
    return true
  }
  const permissions = ctx.store.get(STORE_PERMISSIONS) as Permissions
  const [first, ...actions] = permission.split('.')
  let currentPermissions = permissions.get(first)
  for (const action of actions) {
    if (currentPermissions instanceof Set) {
      return currentPermissions.has(action)
    }
    if (currentPermissions instanceof Map) {
      currentPermissions = currentPermissions.get(action)
      continue
    }
    return false
  }
}
