import { users, roles, permissions, userRoles, rolePermissions } from '../../models/drizzle-orm/schemas'
import { db, pool } from './client'
import { hash } from '@packages/shared'

async function seed() {
  // 建立角色
  const [adminRole] = await db
    .insert(roles)
    .values({ name: 'admin' })
    .onDuplicateKeyUpdate({ set: { name: 'admin' } })
    .$returningId()

  const [] = await db
    .insert(roles)
    .values({ name: 'editor' })
    .onDuplicateKeyUpdate({ set: { name: 'editor' } })
    .$returningId()

  // 建立權限
  const permissionSchema = {
    content: ['read', 'create', 'update', 'delete'],
  }
  const allPermissions = Object.entries(permissionSchema).flatMap(([feature, actions]) =>
    actions.map(action => `${feature}:${action}`)
  )
  const insertedPermissions = await Promise.all(
    allPermissions.map(name =>
      db
        .insert(permissions)
        .values({ name })
        .onDuplicateKeyUpdate({ set: { name } })
        .$returningId()
    )
  )

  // 建立一個管理員帳號
  const [adminUser] = await db
    .insert(users)
    .values({
      username: 'admin',
      password: hash('password'),
    })
    .onDuplicateKeyUpdate({ set: { username: 'admin' } })
    .$returningId()

  // 關聯 admin → adminRole
  await db
    .insert(userRoles)
    .values({ userId: adminUser.id, roleId: adminRole.id })
    .onDuplicateKeyUpdate(
      { set: { userId: adminUser.id, roleId: adminRole.id } }
    )

  // 關聯 adminRole → allPermissions
  for (const perm of insertedPermissions.flat()) {
    await db
      .insert(rolePermissions)
      .values({ roleId: adminRole.id, permissionId: perm.id })
      .onDuplicateKeyUpdate(
        { set: { roleId: adminRole.id, permissionId: perm.id } }
      )
  }

  console.log('✅ Seed 完成')
}

seed()
  .then(() => {
    pool.end()
  })
  .catch((err) => {
    console.error('❌ Seed 失敗', err)
    process.exit(1)
  })
