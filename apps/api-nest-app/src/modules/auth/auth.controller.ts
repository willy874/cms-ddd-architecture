import { Body, Controller, Post, Get, HttpCode, Query, Headers, UseGuards } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { AuthService } from './auth.service'
import { AuthRegisterRequestDto } from './auth.dto'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, LoginValidationException, UserAlreadyExistsException, UserNotFoundException } from './errors'
import { UserService } from './imports/user'
import { HASH_SECRET, TOKEN_TYPE } from './constants'
import { AuthGuard } from './auth.guard'

function hash(str: string) {
  return SHA256(str + HASH_SECRET).toString()
}

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
    const hashPassword = hash(password)
    if (user.password !== hashPassword) {
      throw new LoginFailException()
    }
    const result = await this.authService.generateTokens(user.id)
    return {
      code: 200,
      data: {
        tokenType: TOKEN_TYPE,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
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
        password: hash(password),
      })
    )
    return {
      code: 201,
      message: 'User created successfully.',
    }
  }

  @Get('/check')
  async checkByUsername(
    @Query('username') username: string
  ) {
    const user = await this.userService.getUserByName(username)
    if (user) {
      return true
    }
    throw new UserNotFoundException()
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(
    @Headers('authorization') authorization: string
  ) {
    const [, token] = authorization.split(' ')
    const payload = await this.authService.getUserPayloadByToken(token)
    if (!payload) {
      throw new InvalidTokenException()
    }
    const user = await this.authService.getUserMe(payload.uid)
    return {
      code: 200,
      data: user,
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
    const isPass = await this.authService.verifyRefreshToken(refreshToken)
    if (!isPass) {
      throw new InvalidTokenException()
    }
    const [, token] = authorization.split(' ')
    const payload = await this.authService.getUserPayloadByToken(token)
    if (!payload) {
      throw new InvalidTokenException()
    }
    const result = await this.authService.generateTokens(payload.uid)
    return {
      code: 200,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    }
  }

  @Post('/logout')
  async logout(
    @Headers('authorization') authorization?: string
  ) {
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [, token] = authorization.split(' ')
    await this.authService.removeToken(token)
    return {
      code: 200,
      message: 'Logout successfully.',
    }
  }
}
