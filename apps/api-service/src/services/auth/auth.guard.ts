import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common'
import { to } from 'await-to-js'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '@/shared/errors'
import { Jwt, TOKEN_TYPE } from '@packages/shared'
import { CACHE_PROVIDER } from '@/shared/cache'
import { ICacheRepository } from '@/shared/cache/cache.repository'
import { parseJson } from '@/shared/utils/json'
import { TokenService } from './token.service'
import type { TokenCache } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    @Inject(CACHE_PROVIDER) private cache: ICacheRepository
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const authorization = request.headers['authorization']
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== TOKEN_TYPE) {
      throw new InvalidTokenException()
    }
    const [jwtError, payload] = await to(this.tokenService.parseAccessToken(token))
    if (jwtError) {
      if (jwtError instanceof Jwt.ExpiredError) {
        throw new TokenExpiredException()
      }
      throw new InvalidTokenException()
    }
    if (!payload || !payload.jti) {
      throw new InvalidTokenException()
    }
    const [cacheError, tokenCacheString] = await to(this.cache.get(payload.jti))
    if (cacheError || !tokenCacheString) {
      throw new InvalidTokenException()
    }
    const tokenCache = parseJson<TokenCache>(tokenCacheString)
    if (!tokenCache || tokenCache.accessToken !== token) {
      throw new InvalidTokenException()
    }
    return true
  }
}
