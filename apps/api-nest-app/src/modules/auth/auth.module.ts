import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TOKEN_SECRET } from '@/shared/constants'
import { DatabaseModule } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { TokenService } from './token'
import { UserRepositoryProvider, UserService } from './user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ secretOrPrivateKey: TOKEN_SECRET }),
    CacheModule,
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
