import { Body, Controller, Post, Get, Req, HttpCode, Query, Inject } from '@nestjs/common'
import type { Request } from 'express'
import { SHA256 } from 'crypto-js'
import { JwtService } from '@nestjs/jwt'
import { TokenService } from './token.service'
import type { UserMe } from './token.service'
import { AuthRegisterRequestDto, AuthUserMeResponseDto } from './auth.dto'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, LoginValidationException, UserAlreadyExistsException, UserNotFoundException } from './errors'
import { USER_SERVICE, UserService } from './imports/user'

export const TOKEN_TYPE = 'Bearer'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(USER_SERVICE)
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    // private userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body('username') username?: string,
    @Body('password') password?: string,
  ) {
    if (!username || !password) {
      throw new LoginValidationException()
    }
    const user = await this.userService.getUserByName(username)
    if (!user) {
      throw new LoginFailException()
    }
    const hashPassword = SHA256(password).toString()
    if (user.password !== hashPassword) {
      throw new LoginFailException()
    }
    const payload = { uid: user.id } satisfies UserMe
    const jwt = this.jwtService.sign(payload)
    await this.tokenService.setToken(`${TOKEN_TYPE} ${jwt}`, payload)
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
      throw new LoginValidationException()
    }
    const user = await this.userService.getUserByName(username)
    if (user) {
      throw new UserAlreadyExistsException()
    }
    await this.userService.createUser(
      new AuthRegisterRequestDto({
        username,
        password: SHA256(password).toString(),
      })
    )
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
    throw new UserNotFoundException()
  }

  @Get('/me')
  async me(
    @Req() request: Request
  ) {
    const authorization = request.headers['authorization']
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const payload = await this.tokenService.getUserPayloadByToken(authorization)
    if (!payload) {
      throw new InvalidTokenException()
    }
    const user = await this.userService.getUserById(payload.uid)
    if (!user) {
      throw new InvalidTokenException()
    }
    return {
      code: 200,
      data: new AuthUserMeResponseDto(user).clone(),
    }
  }
}
