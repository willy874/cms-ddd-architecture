import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@/entities/user.entity'
import { DatabaseModule, getRepository } from '@/shared/database'
import type { IRepository } from '@/shared/database'
import { CacheModule } from '@/shared/cache'
import { HASH_SECRET } from '@/shared/constants'
import { TokenModule } from '@/shared/token'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRepositoryProvider } from './user.repository'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: SHA256('password' + HASH_SECRET).toString(),
  roles: [],
}

describe('UserController', () => {
  let userController: UserController
  let userRepository: IRepository<User>
  let queryPage = jest.fn()

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TokenModule, CacheModule],
      providers: [UserRepositoryProvider, UserService],
      controllers: [UserController],
    }).compile()
    userController = app.get(UserController)

    userRepository = getRepository(User)
    queryPage = userRepository.queryPage as jest.Mock
  })

  describe('User', () => {
    it('getUsers', async () => {
      const mockData = {
        list: [MOCK_USER],
        page: 1,
        total: 1,
      }
      queryPage.mockResolvedValue(mockData)
      const res = await userController.getUsers({})
      expect(res).toEqual({
        code: 200,
        data: mockData,
      })
    })
  })
})
