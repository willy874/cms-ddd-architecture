import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '@/shared/errors'
import { TOKEN_TYPE } from '@/shared/constants'
import { TokenService } from '@/shared/token'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
  ) {}

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
    if (this.tokenService.isAccessTokenExpired(token)) {
      throw new TokenExpiredException()
    }
    return true
  }
}
