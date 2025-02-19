import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'
import { AuthRegisterRequestDto } from '../auth/auth.dto'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: UserRepository,
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
