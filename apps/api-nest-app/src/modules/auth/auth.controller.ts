import { Body, Controller, Post, HttpException, HttpStatus, Get, Req, HttpCode, Query } from '@nestjs/common'
import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AuthService, UserMe } from './auth.service'
import { UserService } from './user.service'

const TOKEN_TYPE = 'Bearer'

function hash(password: string) {
  return password
}

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body('username') username?: string,
    @Body('password') password?: string,
  ) {
    if (!username || !password) {
      throw new HttpException('Username and password are required.', HttpStatus.BAD_REQUEST)
    }
    const user = await this.userService.getUserByName(username)
    if (!user) {
      throw new HttpException('Incorrect name or password.', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = hash(password)
    if (user.password !== hashPassword) {
      throw new HttpException('Incorrect name or password.', HttpStatus.BAD_REQUEST)
    }
    const payload = { uid: user.id } satisfies UserMe
    const jwt = this.jwtService.sign(payload)
    await this.authService.setToken(`${TOKEN_TYPE} ${jwt}`, payload)
    return {
      code: 200,
      data: {
        tokenType: TOKEN_TYPE,
        accessToken: jwt,
      },
    }
  }

  @Post('/register')
  @HttpCode(201)
  async register(
  @Body('username') username?: string,
  @Body('password') password?: string,
  ) {
    if (!username || !password) {
      throw new HttpException('Username and password are required.', HttpStatus.BAD_REQUEST)
    }
    const user = await this.userService.getUserByName(username)
    if (user) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST)
    }
    await this.userService.createUser({
      username,
      password: hash(password),
    })
    return {
      code: 201,
      message: 'User created successfully.',
    }
  }

  @Get('/check')
  async checkByUsername(@Query('username') username: string) {
    const user = await this.userService.getUserByName(username)
    if (user) {
      return true
    }
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
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
