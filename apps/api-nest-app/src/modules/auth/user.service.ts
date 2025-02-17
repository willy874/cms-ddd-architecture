import { Inject, Injectable } from '@nestjs/common'
import { INJECT_KEY as USER_REPOSITORY, userRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'

export type ProductRepository = GetProviderType<typeof userRepositoryProvider>

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: ProductRepository,
  ) {}

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  createUser(payload: { username: string, password: string }) {
    return this.userRepository.save({ ...payload })
  }
}
