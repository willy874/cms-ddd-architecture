import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { TokenService } from './token.service'
import { UserModule } from './imports/user'

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    JwtModule.register({ secretOrPrivateKey: 'secretKey' }),
    UserModule,
  ],
  providers: [TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
