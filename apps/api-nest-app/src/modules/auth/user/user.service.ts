import { Inject, Injectable } from '@nestjs/common'
import { AUTH_USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType } from '@/utils/types'
import { LoginDto } from '../login.dto'
import { RegisterDto } from '../register.dto'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(AUTH_USER_REPOSITORY) private userRepository: UserRepository,
  ) {}

  getUserByNameAndPassword(dto: LoginDto) {
    return this.userRepository.findOne({ where: { ...dto } })
  }

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  createUser(dto: RegisterDto) {
    return this.userRepository.save({ ...dto })
  }
}
