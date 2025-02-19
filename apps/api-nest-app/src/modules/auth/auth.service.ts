import { Inject, Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'
import { TokenExpiredException } from './errors'

export interface UserMe {
  uid: number
}

export interface UserPayload extends UserMe {
  accessToken: string
  refreshToken: string
}

export const ACCESS_SECRET = 'ACCESS_SECRET'
export const REFRESH_SECRET = 'REFRESH_SECRET'
export const TOKEN_TYPE = 'Bearer'

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
    private jwtService: JwtService,
  ) {}

  async setToken(jwt: string, value: UserMe) {
    await this.removeToken(jwt)
    await this.cacheRepository.set(jwt, JSON.stringify(value))
  }

  async generateTokens(me: UserMe) {
    const accessToken = this.jwtService.sign(me, { secret: ACCESS_SECRET, expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(me, { secret: REFRESH_SECRET, expiresIn: '7d' })
    const payload = { ...me, accessToken, refreshToken }
    await Promise.all([
      this.cacheRepository.set(accessToken, JSON.stringify(payload)),
      this.cacheRepository.set(refreshToken, JSON.stringify(payload)),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  validateToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret }).then(() => true).catch((error) => {
      if (error instanceof TokenExpiredError) {
        return Promise.reject(new TokenExpiredException())
      }
      return Promise.resolve(false)
    })
  }

  async removeToken(jwt: string) {
    const userPayload = await this.cacheRepository.get(jwt) || 'null'
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

  async getUserPayloadByToken(jwt: string) {
    const value = await this.cacheRepository.get(jwt)
    if (!value) {
      return null
    }
    return JSON.parse(value) as UserPayload
  }
}
