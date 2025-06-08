import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { to } from 'await-to-js'
import type { Request } from 'express'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from '@/shared/errors'
import { TokenService } from './token.service'
import { Jwt, TOKEN_TYPE } from '@packages/shared'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

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
    const [jwtError] = await to(this.tokenService.parseAccessToken(token))
    if (jwtError) {
      if (jwtError instanceof Jwt.ExpiredError) {
        throw new TokenExpiredException()
      }
      throw new InvalidTokenException()
    }
    return true
  }
}
