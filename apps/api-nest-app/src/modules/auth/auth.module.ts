import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './token.service'
import { UserService } from './user.service'
import { userRepositoryProvider } from './user.repository'

@Module({
  imports: [DatabaseModule, CacheModule, JwtModule.register({
    secretOrPrivateKey: 'secretKey',
  })],
  providers: [userRepositoryProvider, TokenService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
