import { HttpException, HttpStatus } from '@nestjs/common'

export class LoginValidationException extends HttpException {
  readonly name = 'LoginValidationException'
  constructor() {
    super('Username and password are required.', HttpStatus.BAD_REQUEST)
  }
}

export class LoginFailException extends HttpException {
  readonly name = 'LoginFailException'
  constructor() {
    super('Login fail!', HttpStatus.BAD_REQUEST)
  }
}

export class UserAlreadyExistsException extends HttpException {
  readonly name = 'UserAlreadyExistsException'
  constructor() {
    super('User already exists.', HttpStatus.BAD_REQUEST)
  }
}

export class UserNotFoundException extends HttpException {
  readonly name = 'UserNotFoundException'
  constructor() {
    super('User not found.', HttpStatus.NOT_FOUND)
  }
}

export class AuthorizationHeaderRequiredException extends HttpException {
  readonly name = 'AuthorizationHeaderRequiredException'
  constructor() {
    super('Authorization header is required', HttpStatus.UNAUTHORIZED)
  }
}

export class InvalidTokenException extends HttpException {
  readonly name = 'InvalidTokenException'
  constructor() {
    super('Invalid token', HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends HttpException {
  readonly name = 'TokenExpiredException'
  constructor() {
    super('Token expired', HttpStatus.UNAUTHORIZED)
  }
}
