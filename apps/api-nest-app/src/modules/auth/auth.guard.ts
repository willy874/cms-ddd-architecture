import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import type { Request } from 'express'
import { TOKEN_TYPE } from '@/shared/constants'
import { AuthorizationHeaderRequiredException, InvalidTokenException } from '@/shared/errors'
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

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
    return this.authService.verifyAccessToken(token)
  }
}
