import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { UserRepositoryProvider } from './user.repository'

@Module({
  imports: [DatabaseModule],
  providers: [UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class RoleUserModule {}
