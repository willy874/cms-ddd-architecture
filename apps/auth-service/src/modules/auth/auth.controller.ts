import { Body, Controller, Post, Get, HttpCode, Query, Headers, UseGuards } from '@nestjs/common'
import { TOKEN_TYPE, hash } from '@packages/shared'
import { ZodValidationPipe } from '@/shared/utils/validation'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException, UserAlreadyExistsException } from '@/shared/error'
import { AuthService } from './auth.service'
import { LoginDto, LoginDtoSchema } from './login.dto'
import { RegisterDto } from './register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new ZodValidationPipe(LoginDtoSchema)) body: LoginDto,
  ) {
    const user = await this.authService.getUserByNameAndPassword({
      username: body.username,
      password: hash(body.password),
    })
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
    @Body() body: RegisterDto,
  ) {
    if (await this.authService.isAlreadyExistsByUsername(body.username)) {
      throw new UserAlreadyExistsException()
    }
    const createDto = {
      username: body.username,
      password: hash(body.password),
    }
    await this.authService.createUser(createDto)
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
    if (!(payload?.refreshToken === refreshToken)) {
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
