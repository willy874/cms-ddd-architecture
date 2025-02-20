import { Body, Controller, Post, Get, HttpCode, Query, Headers, HttpException } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { to } from 'await-to-js'
import { AuthService } from './auth.service'
import { HASH_SECRET, TOKEN_TYPE } from '@/shared/constants'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, LoginValidationException, TokenExpiredException, UserAlreadyExistsException, UserNotFoundException } from '@/shared/errors'
import { UserService } from './imports/user'
import { z, ZodError } from 'zod'
import { TokenService } from '@/shared/token'

function hash(str: string) {
  return SHA256(str + HASH_SECRET).toString()
}

const LoginRequestDtoSchema = z.object({
  username: z.string(),
  password: z.string(),
})

async function schemaValidate<T extends z.ZodObject<any, any>>(schema: T, value: unknown): Promise<z.infer<T>> {
  try {
    return schema.parseAsync(value)
  }
  catch (error) {
    if (error instanceof ZodError) {
      throw new HttpException({
        code: 400,
        issues: error.issues,
      }, 400)
    }
  }
}

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
      throw new LoginValidationException()
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
    if (!username || !password) {
      throw new LoginValidationException()
    }
    const user = await this.userService.getUserByName(username)
    if (user) {
      throw new UserAlreadyExistsException()
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
  async me(
    @Headers('authorization') authorization: string
  ) {
    if (!authorization) {
      throw new AuthorizationHeaderRequiredException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== TOKEN_TYPE) {
      throw new InvalidTokenException()
    }
    if (this.tokenService.isAccessTokenExpired(token)) {
      throw new TokenExpiredException()
    }
    const payload = await this.authService.getUserPayloadByToken(token)
    if (!payload) {
      throw new InvalidTokenException()
    }
    const user = await this.userService.getUserById(payload.uid)
    if (!user) {
      throw new InvalidTokenException()
    }
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
    if (this.tokenService.isRefreshTokenExpired(refreshToken)) {
      throw new TokenExpiredException()
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
