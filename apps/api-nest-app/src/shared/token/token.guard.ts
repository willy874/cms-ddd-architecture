import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '@/shared/error'
import { TOKEN_TYPE } from '@/shared/constants'
import { TokenService } from '@/shared/token'
import { CACHE_PROVIDER, CacheRepository } from '../cache'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
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
    const cachePayload = await this.cacheRepository.get(token)
    if (!cachePayload) {
      throw new InvalidTokenException()
    }
    return true
  }
}
