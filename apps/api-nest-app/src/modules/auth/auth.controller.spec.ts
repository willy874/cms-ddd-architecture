import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@/entities/user.entity'
import { getRepository } from '@/shared/database'
import type { IRepository } from '@/shared/database/Repository'
import { CacheModule, CacheService, getCurrentCache } from '@/shared/cache'
import { HASH_SECRET, TOKEN_TYPE } from '@/shared/constants'
import { TokenModule } from '@/shared/token'
import { UserModule } from './user'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

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
  let userRepository: IRepository<User>
  let findOne = jest.fn()
  let cacheRepository: CacheService
  let cacheGet = jest.fn()

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UserModule, TokenModule, CacheModule],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile()
    authController = app.get(AuthController)

    userRepository = getRepository(User)
    findOne = userRepository.findOne as jest.Mock

    cacheRepository = getCurrentCache()
    cacheGet = cacheRepository.get as jest.Mock
  })

  describe('Auth', () => {
    it('register', async () => {
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
      findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))
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
      findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))

      const res = await authController.checkByUsername('admin')
      expect(res).toEqual(true)
    })
  })
})
