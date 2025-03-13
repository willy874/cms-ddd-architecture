import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.BAD_REQUEST,
      message: 'User already exists',
    }, HttpStatus.BAD_REQUEST)
  }
}