import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule, User, UserService } from './imports/user'
import { DatabaseModule } from '@/shared/database'
import { getRepository } from '@/shared/database/repositoryMap'
import type { IRepository } from '@/shared/database/Repository'
import { CacheModule, type CacheRepository } from '@/shared/cache'
import { getCurrentCache } from '@/shared/cache/cacheRef'
import { HASH_SECRET, TOKEN_TYPE } from '../../shared/constants'
import { TokenModule, TokenService } from '@/shared/token'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: SHA256('password' + HASH_SECRET).toString(),
  roles: [],
}
const MOCK_USER_ME = {
  uid: MOCK_USER.id,
  user: MOCK_USER,
  permissions: [],
}

describe('AuthController', () => {
  let authController: AuthController
  let userRepository: IRepository<User>
  let findOne = jest.fn()
  let cacheRepository: CacheRepository
  let cacheGet = jest.fn()

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CacheModule,
        TokenModule,
        UserModule,
      ],
      providers: [TokenService, UserService, AuthService],
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
      const res = await authController.register('admin', 'password')
      expect(res).toEqual({
        code: 201,
        message: 'User created successfully.',
      })
    })
    it('login', async () => {
      let accessToken = ''
      let refreshToken = ''

      findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))
      const res = await authController.login('admin', 'password')
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
