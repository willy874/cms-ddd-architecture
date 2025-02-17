import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UserService } from './user.service'

@Module({
  imports: [DatabaseModule, CacheModule, JwtModule.register({
    secretOrPrivateKey: 'secretKey',
  })],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
