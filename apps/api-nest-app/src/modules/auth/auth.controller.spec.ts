import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { User } from '@/entities/user.entity'
import { CacheService, getCurrentCache } from '@/shared/cache'
import { HASH_SECRET, TOKEN_TYPE } from '@/shared/constants'
import { AuthController } from './auth.controller'
import { authModuleOptions } from './auth.module'
const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: SHA256('password' + HASH_SECRET).toString(),
  roles: [],
}
const MOCK_USER_ME = {
  user: MOCK_USER,
  permissions: [],
}

describe('AuthController', () => {
  let authController: AuthController
  let queryBus: jest.Mocked<QueryBus>
  let commandBus: jest.Mocked<CommandBus>
  let cacheRepository: CacheService
  let cacheGet = jest.fn()

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...authModuleOptions.imports],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        ...authModuleOptions.providers,
      ],
      controllers: [AuthController],
    }).compile()
    authController = app.get(AuthController)
    queryBus = app.get(QueryBus)
    commandBus = app.get(CommandBus)

    cacheRepository = getCurrentCache()
    cacheGet = cacheRepository.get as jest.Mock
  })

  describe('Auth', () => {
    it('register', async () => {
      queryBus.execute.mockImplementationOnce(() => Promise.resolve({ t: 'user-name', data: null }))
      commandBus.execute.mockImplementationOnce(() => Promise.resolve())
      const res = await authController.register({
        username: 'admin',
        password: 'password',
      })
      expect(res).toEqual({
        code: 201,
        message: 'User created successfully.',
      })
    })
    it('login', async () => {
      let accessToken = ''
      let refreshToken = ''
      queryBus.execute.mockImplementationOnce(() => Promise.resolve({ t: 'login', data: MOCK_USER }))
      queryBus.execute.mockImplementationOnce(() => Promise.resolve({ t: 'userid', data: MOCK_USER }))
      const res = await authController.login({
        username: 'admin',
        password: 'password',
      })
      accessToken = res.data.accessToken
      refreshToken = res.data.refreshToken
      expect(res).toEqual({
        code: 200,
        data: {
          tokenType: TOKEN_TYPE,
          accessToken,
          refreshToken,
        },
      })
    })
    it('me', async () => {
      queryBus.execute.mockImplementationOnce(() => Promise.resolve({ t: 'user-name', data: MOCK_USER }))
      const token = `${TOKEN_TYPE} accessToken`
      cacheGet.mockImplementationOnce((k) => {
        const me = {
          uid: 1,
          user: MOCK_USER,
          permissions: [],
        }
        const map = { [k]: JSON.stringify(me) }
        return Promise.resolve(map[k] || null)
      })

      const res = await authController.me(token)
      expect(res).toEqual({
        code: 200,
        data: MOCK_USER_ME,
      })
    })
    it('checkByUsername', async () => {
      queryBus.execute.mockImplementationOnce(() => Promise.resolve({ t: 'user-name', data: MOCK_USER }))
      const res = await authController.checkByUsername('admin')
      expect(res).toEqual(true)
    })
  })
})
