import { HttpException, HttpStatus } from '@nestjs/common'

export class LoginFailException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Login failed',
    }, HttpStatus.UNAUTHORIZED)
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.BAD_REQUEST,
      message: 'User already exists',
    }, HttpStatus.BAD_REQUEST)
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.NOT_FOUND,
      message: 'User not found',
    }, HttpStatus.NOT_FOUND)
  }
}

export class AuthorizationHeaderRequiredException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Authorization header is required',
    }, HttpStatus.UNAUTHORIZED)
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Invalid token',
    }, HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.UNAUTHORIZED,
      message: 'Token expired',
    }, HttpStatus.UNAUTHORIZED)
  }
}
