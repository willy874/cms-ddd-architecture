import { Inject, Injectable } from '@nestjs/common'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'
import { TokenService } from '@/shared/token'

export interface BaseUserPayload {
  uid: number
  permissions: string[]
}

export interface UserPayload extends BaseUserPayload {
  accessToken: string
  refreshToken: string
}

export interface UserInfo {
  username: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
    private tokenService: TokenService,
  ) {}

  async generateTokens(uid: number) {
    const tokenPayload = { uid, permissions: [] } satisfies BaseUserPayload
    const accessToken = this.tokenService.createAccessToken(tokenPayload)
    const refreshToken = this.tokenService.createRefreshToken(tokenPayload)
    const payload = { ...tokenPayload, accessToken, refreshToken }
    await Promise.all([
      this.cacheRepository.set(accessToken, JSON.stringify(payload)),
      this.cacheRepository.set(refreshToken, JSON.stringify(payload)),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async removeToken(token: string) {
    const userPayload = await this.cacheRepository.get(token) || 'null'
    const payload = JSON.parse(userPayload) as UserPayload
    if (payload) {
      await Promise.all([
        this.cacheRepository.del(payload.accessToken),
        this.cacheRepository.del(payload.refreshToken),
      ])
      return true
    }
    return false
  }

  async getUserPayloadByToken(token: string) {
    const value = await this.cacheRepository.get(token)
    if (!value) {
      return null
    }
    return JSON.parse(value) as UserPayload
  }
}
