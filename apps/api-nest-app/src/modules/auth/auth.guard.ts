import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import type { Request } from 'express'
import { ACCESS_SECRET, TOKEN_TYPE } from './constants'
import { AuthorizationHeaderRequiredException, InvalidTokenException, TokenExpiredException } from './errors'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  verifyAccessToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: ACCESS_SECRET })
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
