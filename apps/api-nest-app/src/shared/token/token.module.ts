import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TOKEN_SECRET } from '../constants'
import { CacheModule } from '../cache'
import { TokenService } from './token.service'
import { cacheProvider } from './token.repository'

@Module({
  imports: [CacheModule, JwtModule.register({ secretOrPrivateKey: TOKEN_SECRET })],
  providers: [cacheProvider, JwtService, TokenService],
  exports: [cacheProvider, JwtService, TokenService],
})
export class TokenModule {}
