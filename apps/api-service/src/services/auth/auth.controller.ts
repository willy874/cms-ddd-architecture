import { Body, Controller, Post, Get, HttpCode, Headers, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { to } from 'await-to-js'
import { TOKEN_TYPE } from '@packages/shared'
import { ZodValidationPipe } from '@/shared/utils/validation'
import { AuthorizationHeaderRequiredException, InvalidTokenException, LoginFailException } from '@/shared/errors'
import { AuthService } from './auth.service'
import { LoginDto, LoginDtoSchema } from './login.dto'
import { RegisterDto } from './register.dto'
import { AuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new ZodValidationPipe(LoginDtoSchema)) body: LoginDto,
  ) {
    const user = await this.authService.loginCheck({
      username: body.username,
      password: body.password,
    })
    if (!user) {
      throw new LoginFailException()
    }
    const result = await this.authService.signin(user)
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
    @Body() body: RegisterDto
  ) {
    const createDto = {
      username: body.username,
      password: body.password,
    }
    const [error] = await to(this.authService.createUser(createDto))
    if (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
    return {
      code: 201,
      message: 'User created successfully.',
    }
  }

  @Get('/check')
  @UseGuards(AuthGuard)
  checkByUsername() {
    return { code: 200, date: true }
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@Headers('authorization') authorization: string) {
    const [, token] = authorization.split(' ')
    const [err, user] = await to(this.authService.getUserInfoByAccessToken(token))
    if (err || !user) {
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
    if (!refreshToken) {
      throw new InvalidTokenException()
    }
    const [type, token] = authorization.split(' ')
    if (type !== TOKEN_TYPE) {
      throw new InvalidTokenException()
    }
    const [err, tokenResult] = await to(this.authService.refreshToken(token, refreshToken))
    if (err || !tokenResult) {
      throw new InvalidTokenException()
    }
    return {
      code: 200,
      data: tokenResult,
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
    await this.authService.signout(token)
    return {
      code: 200,
      message: 'Logout successfully.',
    }
  }
}
