import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    UserRepositoryProvider,
    UserService,
  ],
  exports: [
    UserRepositoryProvider,
    UserService,
  ],
})
export class UserModule {}
