import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/database'
import { MockCacheModule } from '@/shared/cache/cache.module.mock'
import { AuthController, TOKEN_TYPE } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { TokenService } from './token.service'
import { UserService } from './user.service'

describe('AuthController', () => {
  let authController: AuthController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, MockCacheModule, JwtModule.register({
        secretOrPrivateKey: 'secretKey',
      })],
      providers: [TokenService, UserService],
      controllers: [AuthController],
    }).compile()

    authController = app.get(AuthController)
  })

  describe('Auth', () => {
    let accessToken = ''
    it('register', async () => {
      const res = await authController.register('admin', 'password')
      expect(res).toEqual({
        code: 201,
        message: 'User created successfully.',
      })
    })
    it('login', async () => {
      const res = await authController.login('admin', 'password')
      accessToken = res.data.accessToken
      expect(res).toEqual({
        code: 200,
        data: {
          tokenType: TOKEN_TYPE,
          accessToken,
        },
      })
    })
  })
})
