import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '@/shared/error'
import { TOKEN_TYPE } from '@/shared/constants'
import { TokenService } from '@/shared/token'
import { CacheService } from '@/shared/cache'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const authorization = request.headers.authorization
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== TOKEN_TYPE) {
      throw new InvalidTokenException()
    }
    if (this.tokenService.isAccessTokenExpired(token)) {
      throw new TokenExpiredException()
    }
    const cachePayload = await this.cacheService.get(token)
    if (!cachePayload) {
      throw new InvalidTokenException()
    }
    return true
  }
}
