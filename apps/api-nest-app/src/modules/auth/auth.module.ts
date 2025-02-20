import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule, UserService } from './imports/user'
import { TokenModule, TokenService } from '@/shared/token'

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    TokenModule,
    UserModule,
  ],
  providers: [TokenService, UserService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
