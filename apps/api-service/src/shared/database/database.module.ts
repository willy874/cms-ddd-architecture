import { Module } from '@nestjs/common'
import { DatabaseProvider } from './database.provider'
import { RoleRepositoryProvider } from './role.repository'
import { UserRepositoryProvider } from './user.repository'
import { PermissionRepositoryProvider } from './permission.repository'

@Module({
  imports: [],
  providers: [DatabaseProvider, PermissionRepositoryProvider, RoleRepositoryProvider, UserRepositoryProvider],
  exports: [DatabaseProvider, PermissionRepositoryProvider, RoleRepositoryProvider, UserRepositoryProvider],
})
export class DatabaseModule {}
