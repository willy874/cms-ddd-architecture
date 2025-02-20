import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'
import { Like } from 'typeorm'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

interface QueryUserParams {
  page: number
  limit: number
  search?: string
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
  ) {}

  getUserByNameAndPassword(username: string, password: string) {
    return this.userRepository.findOne({ where: { username, password } })
  }

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  createUser(payload: { username: string, password: string }) {
    return this.userRepository.save({ ...payload })
  }

  async queryPage({ page, limit, search }: QueryUserParams) {
    const skip = (page - 1) * limit
    const where = search ? { username: Like(`%${search}%`) } : undefined
    const [list, total] = await this.userRepository.findAndCount({
      skip: skip,
      take: limit,
      where,
    })
    return {
      list,
      page,
      total,
    }
  }

  updateUser(id: number, payload: { username: string, password: string }) {
    return this.userRepository.update(id, { ...payload })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
