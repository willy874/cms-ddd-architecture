import { Inject, Injectable } from '@nestjs/common'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'

export interface UserMe {
  uid: number
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
  ) {}

  async setToken(jwt: string, value: UserMe) {
    const userPayload = await this.cacheRepository.get(jwt)
    if (userPayload) {
      await this.cacheRepository.del(jwt)
    }
    await this.cacheRepository.set(jwt, JSON.stringify(value))
  }

  async getUserByToken(jwt: string) {
    const value = await this.cacheRepository.get(jwt)
    if (!value) {
      return null
    }
    return JSON.parse(value) as UserMe
  }
}
