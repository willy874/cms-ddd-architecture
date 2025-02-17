import { Inject, Injectable } from '@nestjs/common'
import { INJECT_KEY as USER_REPOSITORY, userRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'
import { AuthRegisterRequestDto } from './auth.dto'

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

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  createUser(payload: AuthRegisterRequestDto) {
    return this.userRepository.save({ ...payload })
  }
}
