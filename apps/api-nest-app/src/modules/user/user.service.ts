import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType, QueryParams } from '@/utils/types'
import { TokenService } from '@/shared/token'
import { CacheService } from '@/shared/cache'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private cacheService: CacheService,
    private userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  queryPage(params: QueryParams): Promise<QueryPageResult> {
    return this.userRepository.queryPage(params)
  }

  async createCache<T extends QueryParams>(params: T, queryFn: (p: T) => Promise<unknown>) {
    const payload = { resource: 'users' }
    const key = `query:${JSON.stringify(params)}`
    const data = await this.cacheService.get(key)
    if (!data) {
      const resultData = await queryFn(params)
      this.cacheService.set(key, JSON.stringify(resultData))
    }
    const token = await this.tokenService.createQueryToken(payload)
    this.cacheService.set(token, key)
    return token
  }

  async queryByToken(token: string) {
    const key = await this.cacheService.get(token)
    const data = await this.cacheService.get(key)
    return JSON.parse(data) as QueryPageResult
  }

  insertUser(payload: CreateUserDto) {
    return this.userRepository.insert({ ...payload })
  }

  updateUser(id: number, payload: UpdateUserDto) {
    return this.userRepository.update(id, { ...payload })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
