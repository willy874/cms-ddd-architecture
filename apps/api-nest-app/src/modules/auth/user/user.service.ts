import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
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
}
