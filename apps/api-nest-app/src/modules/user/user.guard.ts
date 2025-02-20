import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
// import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '../auth/errors'

const TOKEN_TYPE = 'Bearer'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    // @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
    private jwtService: JwtService,
  ) {}

  verifyAccessToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: 'ACCESS_SECRET' })
      return true
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new TokenExpiredException()
      }
    }
    return false
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const authorization = request.headers.authorization
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== TOKEN_TYPE) {
      throw new InvalidTokenException()
    }
    return this.verifyAccessToken(token)
  }
}
