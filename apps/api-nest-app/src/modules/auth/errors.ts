import { HttpException, HttpStatus } from '@nestjs/common'

export class LoginValidationException extends HttpException {
  constructor() {
    super('Username and password are required.', HttpStatus.BAD_REQUEST)
  }
}

export class LoginFailException extends HttpException {
  constructor() {
    super('Login fail!', HttpStatus.BAD_REQUEST)
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User already exists.', HttpStatus.BAD_REQUEST)
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found.', HttpStatus.NOT_FOUND)
  }
}

export class AuthorizationHeaderRequiredException extends HttpException {
  constructor() {
    super('Authorization header is required', HttpStatus.UNAUTHORIZED)
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid token', HttpStatus.UNAUTHORIZED)
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token expired', HttpStatus.UNAUTHORIZED)
  }
}
