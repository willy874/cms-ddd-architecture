import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TOKEN_SECRET } from '@/shared/constants'
import { CacheModule, CacheService } from '@/shared/cache'
import { TokenService } from './token.service'

@Module({
  imports: [CacheModule, JwtModule.register({ secretOrPrivateKey: TOKEN_SECRET })],
  providers: [CacheService, JwtService, TokenService],
  exports: [CacheService, JwtService, TokenService],
})
export class TokenModule {}
