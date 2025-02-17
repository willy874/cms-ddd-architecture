import { Body, Controller, Post, HttpException, HttpStatus, Get, Req } from '@nestjs/common'
import type { Request } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService, UserMe } from './auth.service'

const TOKEN_TYPE = 'Bearer'

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  async login(
    @Body('username') username?: string,
    @Body('password') password?: string,
  ) {
    if (!username || !password) {
      throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST)
    }
    const user = {
      id: 1,
      username: username,
    }
    const payload = { uid: user.id } satisfies UserMe
    const jwt = this.jwtService.sign(payload)
    this.authService.setToken(`${TOKEN_TYPE} ${jwt}`, payload)
    return {
      code: 200,
      data: {
        tokenType: TOKEN_TYPE,
        accessToken: jwt,
      },
    }
  }

  @Get('/me')
  async me(
    @Req() request: Request
  ) {
    const authorization = request.headers['authorization']
    if (!authorization) {
      throw new HttpException('Authorization header is required', HttpStatus.UNAUTHORIZED)
    }
    const payload = await this.authService.getUserByToken(authorization)
    if (!payload) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
    return {
      code: 200,
      data: payload,
    }
  }
}
