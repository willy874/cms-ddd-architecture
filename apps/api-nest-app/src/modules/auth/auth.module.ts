import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule, UserService } from './imports/user'

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    JwtModule.register({ secretOrPrivateKey: 'secretKey' }),
    UserModule,
  ],
  providers: [UserService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
