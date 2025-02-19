import { Inject, Injectable } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'
import { InvalidTokenException, TokenExpiredException } from './errors'
import { ACCESS_SECRET, REFRESH_SECRET } from './constants'
import { UserService } from './imports/user'

export interface UserMe {
  uid: number
}

export interface UserPayload extends UserMe {
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
    private jwtService: JwtService,
    private userService: UserService,
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

  verifyRefreshToken(token: string) {
    try {
      this.jwtService.verify(token, { secret: REFRESH_SECRET })
      return true
    }
    catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new TokenExpiredException()
      }
    }
    return false
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

  async getUserPayloadByToken(token: string) {
    const value = await this.cacheRepository.get(token)
    if (!value) {
      return null
    }
    return JSON.parse(value) as UserPayload
  }

  async getUserMe(id: number) {
    const user = await this.userService.getUserById(id)
    if (!user) {
      throw new InvalidTokenException()
    }
    return {
      username: user.username,
      permissions: [],
    } as UserInfo
  }
}
