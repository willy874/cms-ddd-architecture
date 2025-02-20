import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule, User } from './imports/user'
import { DatabaseModule } from '@/shared/database'
import { getRepository, setRepository } from '@/shared/database/repositoryMap'
import type { IRepository } from '@/shared/database/Repository'
import { CacheModule, type CacheRepository } from '@/shared/cache'
import { setCurrentCache, getCurrentCache } from '@/shared/cache/cacheRef'
import { HASH_SECRET, TOKEN_TYPE } from '../../shared/constants'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: SHA256('password' + HASH_SECRET).toString(),
  roles: [],
}

jest.mock('@/shared/cache/cache.module', () => {
  const CACHE_PROVIDER = 'CACHE_PROVIDER'
  const cacheProvider = {
    provide: CACHE_PROVIDER,
    useFactory: () => {
      const cache = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
      } satisfies CacheRepository
      setCurrentCache(cache)
      return cache
    },
  }

  return {
    CACHE_PROVIDER,
    CacheModule: {
      module: class {},
      providers: [cacheProvider],
      exports: [cacheProvider],
    },
  }
})

jest.mock('@/shared/database/database.module', () => {
  const DATABASE_PROVIDER = 'DATABASE_PROVIDER'
  const databaseProvider = {
    provide: DATABASE_PROVIDER,
    useFactory: () => {
      return {
        getRepository: (entity) => {
          const repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          } as IRepository<any>
          setRepository(entity, repository)
          return repository
        },
      }
    },
  }

  return {
    DATABASE_PROVIDER,
    DatabaseModule: {
      module: class {},
      providers: [databaseProvider],
      exports: [databaseProvider],
    },
  }
})

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
        JwtModule.register({
          secretOrPrivateKey: 'secretKey',
        }),
        UserModule,
      ],
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
      findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))

      cacheGet.mockImplementationOnce((k) => {
        const map = { [k]: JSON.stringify({ uid: 1 }) }
        return Promise.resolve(map[k] || null)
      })

      const res = await authController.me(token)
      expect(res).toEqual({
        code: 200,
        data: {
          username: 'admin',
        },
      })
    })
    it('checkByUsername', async () => {
      findOne.mockImplementationOnce(() => Promise.resolve(MOCK_USER))

      const res = await authController.checkByUsername('admin')
      expect(res).toEqual(true)
    })
  })
})
