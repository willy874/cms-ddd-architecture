import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt'
import { Request } from 'express'
import { createMockDatabaseModule } from '@/shared/database/database.module.mock'
import { createMockCacheModule } from '@/shared/cache/cache.module.mock'
import { AuthController, TOKEN_TYPE } from './auth.controller'
import { TokenService } from './token.service'
import { UserService } from './user.service'
import { userRepositoryProvider } from './user.repository'
import { User } from './user.entity'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: 'password',
}

describe('AuthController', () => {
  let authController: AuthController
  const databaseBuilder = createMockDatabaseModule<User>()
  const cacheBuilder = createMockCacheModule()

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        databaseBuilder.getModule(),
        cacheBuilder.getModule(),
        JwtModule.register({
          secretOrPrivateKey: 'secretKey',
        }),
      ],
      providers: [userRepositoryProvider, TokenService, UserService],
      controllers: [AuthController],
    }).compile()

    authController = app.get(AuthController)
  })

  describe('Auth', () => {
    it('register', async () => {
      const res = await authController.register('admin', 'password')
      expect(res).toEqual({
        code: 201,
        message: 'User created successfully.',
      })
    })
    it('login', async () => {
      let accessToken = ''
      const instance = databaseBuilder.getRepositoryMockInstance()
      instance.findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))
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
    it('me', async () => {
      const token = `${TOKEN_TYPE} accessToken`
      const request = {} as Request
      request.headers = { authorization: token }

      const instance1 = databaseBuilder.getRepositoryMockInstance()
      instance1.findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))

      const instance2 = cacheBuilder.getMockInstance()
      instance2.get.mockImplementationOnce((k) => {
        const map = { [k]: JSON.stringify({ uid: 1 }) }
        return Promise.resolve(map[k] || null)
      })

      const res = await authController.me(request)
      expect(res).toEqual({
        code: 200,
        data: {
          username: 'admin',
        },
      })
    })
    it('checkByUsername', async () => {
      const instance = databaseBuilder.getRepositoryMockInstance()
      instance.findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))

      const res = await authController.checkByUsername('admin')
      expect(res).toEqual(true)
    })
  })
})
