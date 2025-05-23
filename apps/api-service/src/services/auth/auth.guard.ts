import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { to } from 'await-to-js'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, RedisException, TokenExpiredException, TokenNotInfoException } from '@/shared/errors'
import { CACHE_PROVIDER, CacheService } from '@/shared/cache'
import { TokenService } from './token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheService: CacheService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const authorization = request.headers['authorization']
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== 'Bearer') {
      throw new InvalidTokenException()
    }
    const [jwtExpiredError, isExpired] = await to(this.tokenService.isAccessTokenExpired(token))
    if (jwtExpiredError) {
      throw new InvalidTokenException()
    }
    if (isExpired) {
      throw new TokenExpiredException()
    }
    const [redisError, info] = await to(this.cacheService.get(token))
    if (redisError) {
      throw new RedisException()
    }
    if (!info) {
      throw new TokenNotInfoException()
    }
    return true
  }
}
