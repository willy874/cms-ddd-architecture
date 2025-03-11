import { SHA256 } from 'crypto-js'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@/entities/user.entity'
import { getRepository } from '@/shared/database'
import type { IRepository } from '@/shared/database'
import { HASH_SECRET } from '@/shared/constants'
import { UserController } from './user.controller'
import { userModuleOptions } from './user.module'
import { MessageQueueProducer } from '@/shared/queue'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  password: SHA256('password' + HASH_SECRET).toString(),
  roles: [],
}

describe('UserController', () => {
  let userController: UserController
  let userRepository: IRepository<User>
  let queryPage: jest.Mock
  let producerPublish: jest.Mock

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule(userModuleOptions).compile()
    userController = app.get(UserController)

    userRepository = getRepository(User)
    queryPage = userRepository.queryPage as jest.Mock

    const producer = app.get(MessageQueueProducer)
    producerPublish = producer.publish as jest.Mock
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
    it('createUser', async () => {
      const MOCK_USER_DTO = {
        username: 'admin',
        password: 'password',
        roles: [],
      }
      producerPublish.mockResolvedValue([MOCK_USER_DTO])
      const res = await userController.createUser(MOCK_USER_DTO)
      expect(res).toEqual({ code: 201, data: MOCK_USER_DTO })
    })
  })
})
