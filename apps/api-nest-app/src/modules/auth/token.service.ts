import { Inject, Injectable } from '@nestjs/common'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'

export interface UserMe {
  uid: number
}

@Injectable()
export class TokenService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
  ) {}

  async setToken(jwt: string, value: UserMe) {
    await this.removeToken(jwt)
    await this.cacheRepository.set(jwt, JSON.stringify(value))
  }

  async removeToken(jwt: string) {
    const userPayload = await this.cacheRepository.get(jwt)
    if (userPayload) {
      await this.cacheRepository.del(jwt)
      return true
    }
    return false
  }

  async getUserPayloadByToken(jwt: string) {
    const value = await this.cacheRepository.get(jwt)
    if (!value) {
      return null
    }
    return JSON.parse(value) as UserMe
  }
}
