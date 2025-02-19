import { Body, Controller, Post, Get, HttpCode, Query, Headers } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { AuthService, REFRESH_SECRET, TOKEN_TYPE } from './auth.service'
import { AuthRegisterRequestDto, AuthUserMeResponseDto } from './auth.dto'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, LoginValidationException, UserAlreadyExistsException, UserNotFoundException } from './errors'
import { UserService } from './imports/user'

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
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
    const result = await this.authService.generateTokens({ uid: user.id })
    return {
      code: 200,
      data: {
        tokenType: TOKEN_TYPE,
        ...result,
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
    @Headers('authorization') authorization?: string
  ) {
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const payload = await this.authService.getUserPayloadByToken(authorization)
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

  @Post('/refresh')
  async refresh(
    @Headers('authorization') authorization?: string,
    @Body('refreshToken') refreshToken?: string
  ) {
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const isPass = await this.authService.validateToken(refreshToken, REFRESH_SECRET)
    if (!isPass) {
      throw new InvalidTokenException()
    }
    const payload = await this.authService.getUserPayloadByToken(authorization)
    if (!payload) {
      throw new InvalidTokenException()
    }
    const user = await this.userService.getUserById(payload.uid)
    if (!user) {
      throw new InvalidTokenException()
    }
    const result = this.authService.generateTokens({ uid: user.id })
    return {
      code: 200,
      data: {
        tokenType: TOKEN_TYPE,
        result,
      },
    }
  }
}
