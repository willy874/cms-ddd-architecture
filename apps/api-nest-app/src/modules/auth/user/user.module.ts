import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { UserRepositoryProvider } from './user.repository'
import { AuthUserService } from './user.service'

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    UserRepositoryProvider,
    AuthUserService,
  ],
  exports: [
    UserRepositoryProvider,
    AuthUserService,
  ],
})
export class AuthUserModule {}
