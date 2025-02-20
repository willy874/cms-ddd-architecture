import { Body, Controller, Post, Get, HttpCode, Query, Headers, UseGuards } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { to } from 'await-to-js'
import { AuthService } from './auth.service'
import { HASH_SECRET, TOKEN_TYPE } from '@/shared/constants'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, schemaValidate, UserAlreadyExistsException } from '@/shared/error'
import { UserService } from './imports/user'
import { z } from 'zod'
import { TokenService, TokenGuard } from '@/shared/token'

function hash(str: string) {
  return SHA256(str + HASH_SECRET).toString()
}

const LoginRequestDtoSchema = z.object({
  username: z.string(),
  password: z.string(),
})

const RegisterRequestDtoSchema = z.object({
  username: z.string(),
  password: z.string(),
})

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('/login')
  async login(
    @Body('username') username?: string,
    @Body('password') password?: string,
  ) {
    const [validationError, reqDto] = await to(schemaValidate(LoginRequestDtoSchema, { username, password }))
    if (validationError) {
      throw validationError
    }
    const user = await this.userService.getUserByNameAndPassword(reqDto.username, hash(reqDto.password))
    if (!user) {
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
    const [validationError, reqDto] = await to(schemaValidate(RegisterRequestDtoSchema, { username, password }))
    if (validationError) {
      throw validationError
    }
    if (await this.authService.isAlreadyExistsByUsername(reqDto.username)) {
      throw new UserAlreadyExistsException()
    }
    const createDto = {
      username: reqDto.username,
      password: hash(reqDto.password),
    }
    await this.userService.createUser(createDto)
    return {
      code: 201,
      message: 'User created successfully.',
    }
  }

  @Get('/check')
  checkByUsername(
    @Query('username') username: string
  ) {
    return this.authService.isAlreadyExistsByUsername(username)
  }

  @Get('/me')
  @UseGuards(TokenGuard)
  async me(
    @Headers('authorization') authorization: string
  ) {
    const [, token] = authorization.split(' ')
    const payload = await this.authService.getUserPayloadByToken(token)
    if (!payload) {
      throw new InvalidTokenException()
    }
    return {
      code: 200,
      data: payload,
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
    const [, token] = authorization.split(' ')
    const payload = await this.authService.getTokenPayloadByToken(token)
    if (payload.refreshToken !== refreshToken) {
      throw new InvalidTokenException()
    }
    if (!payload) {
      throw new InvalidTokenException()
    }
    const result = await this.authService.generateTokens(payload.uid)
    this.authService.removeToken(refreshToken)
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
