import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokenModule, TokenService } from '@/shared/token'
import { UserRepositoryProvider } from './user.repository'
import { UserService } from './user.service'

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    TokenModule,
  ],
  providers: [
    UserRepositoryProvider,
    UserService,
    TokenService,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
