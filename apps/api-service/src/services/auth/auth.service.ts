import { to } from 'await-to-js'
import { v4 as uuid_v4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { AuthUserService, UserInfo } from './user.service'
import { RegisterDto } from './register.dto'
import { REFRESH_TOKEN_EXPIRED_TIME, TokenService } from './token.service'
import { LoginDto } from './login.dto'
import { parseJson, cloneJson } from '@/shared/utils/json'

const MAXIMUM_LOGIN_COUNT = Infinity

export interface SessionCache {
  id: string
  user: UserInfo
  tokens: ({
    tokenId: string
    expiredTime: number
  })[]
}

export interface TokenCache {
  id: string
  sessionCacheId: string
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private cacheService: CacheService,
    private tokenService: TokenService,
    private userService: AuthUserService,
  ) {}

  loginCheck(dto: LoginDto) {
    return this.userService.loginCheck(dto)
  }

  createUser(dto: RegisterDto) {
    return this.userService.insertUser(dto)
  }

  private async getTokenCacheById(id: string) {
    return parseJson<TokenCache>(await this.cacheService.get(id))
  }

  private async getSessionCacheById(id: string) {
    return parseJson<SessionCache>(await this.cacheService.get(id))
  }

  private generateTokenId() {
    return `login_token:${uuid_v4()}`
  }

  private async generateSession(user: UserInfo): Promise<SessionCache> {
    const sessionCacheId = `user:${user.id}`
    const sessionCache = await this.getSessionCacheById(sessionCacheId)
    if (sessionCache) {
      return sessionCache
    }
    return {
      id: sessionCacheId,
      user,
      tokens: [],
    }
  }

  private setTokenCache(tokenCache: TokenCache) {
    return this.cacheService.set(tokenCache.id, JSON.stringify(tokenCache), REFRESH_TOKEN_EXPIRED_TIME)
  }

  private async updateSessionCache(sessionCache: SessionCache) {
    return await this.cacheService.set(
      sessionCache.id,
      JSON.stringify(sessionCache),
      REFRESH_TOKEN_EXPIRED_TIME
    )
  }

  private async getCacheByTokenJti(id: string) {
    const tokenCache = await this.getTokenCacheById(id)
    if (!tokenCache) {
      throw new Error('Invalid refresh token')
    }
    const sessionCache = await this.getSessionCacheById(tokenCache.sessionCacheId)
    if (!sessionCache) {
      throw new Error('Session cache not found')
    }
    return { tokenCache, sessionCache }
  }

  async signin(user: UserInfo) {
    const tokenId = this.generateTokenId()
    const sessionCache = await this.generateSession(user)
    const accessToken = await this.tokenService.createAccessToken({ jti: tokenId })
    const refreshToken = await this.tokenService.createRefreshToken({ jti: tokenId })
    const tokenCache = {
      id: tokenId,
      accessToken,
      refreshToken,
      sessionCacheId: sessionCache.id,
    } satisfies TokenCache
    await this.setTokenCache(tokenCache)
    sessionCache.tokens.push({
      tokenId,
      expiredTime: Date.now() + REFRESH_TOKEN_EXPIRED_TIME,
    })
    while (sessionCache.tokens.length > MAXIMUM_LOGIN_COUNT) {
      const info = sessionCache.tokens.shift()
      if (info) {
        await this.cacheService.del(info.tokenId)
      }
    }
    await this.updateSessionCache(sessionCache)
    return {
      accessToken,
      refreshToken,
    }
  }

  async getUserInfoByAccessToken(token: string) {
    const payload = await this.tokenService.parseAccessToken(token)
    if (!payload.jti) {
      throw new Error('Token ID is required')
    }
    const { sessionCache } = await this.getCacheByTokenJti(payload.jti)
    return sessionCache.user as unknown
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    const payload = await this.tokenService.parseRefreshToken(refreshToken)
    if (!payload.jti) {
      throw new Error('Token ID is required')
    }
    const { tokenCache, sessionCache } = await this.getCacheByTokenJti(payload.jti)
    if (tokenCache.accessToken !== accessToken) {
      throw new Error('Access token does not match the refresh token')
    }
    const index = sessionCache.tokens.findIndex(t => t.tokenId === tokenCache.id)
    if (index >= 0) {
      throw new Error('Refresh token not found in session cache')
    }
    const tokenInfo = cloneJson(sessionCache.tokens[index])
    await this.cacheService.del(tokenInfo.tokenId)
    const tokenId = this.generateTokenId()
    const newTokenInfo = {
      tokenId,
      expiredTime: Date.now() + REFRESH_TOKEN_EXPIRED_TIME,
    }
    const newAccessToken = await this.tokenService.createAccessToken({ jti: tokenId })
    const newRefreshToken = await this.tokenService.createRefreshToken({ jti: tokenId })
    const newTokenCache = {
      id: tokenId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionCacheId: sessionCache.id,
    } satisfies TokenCache
    await this.setTokenCache(newTokenCache)
    const [err, newUserInfo] = await to(this.userService.getUserById(sessionCache.user.id))
    if (err || !newUserInfo) {
      throw new Error('User is not found')
    }
    sessionCache.user = newUserInfo
    sessionCache.tokens[index] = newTokenInfo
    await this.updateSessionCache(sessionCache)
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  async clearSessionCache(id: string) {
    const [err, sessionCache] = await to(this.getSessionCacheById(id))
    if (err || !sessionCache) {
      return
    }
    if (sessionCache.tokens.length === 0) {
      this.cacheService.del(sessionCache.id)
    }
    else {
      const maxLongTime = Math.max(...sessionCache.tokens.map(t => t.expiredTime))
      const maxExpiredTime = Math.max(0, maxLongTime - Date.now())
      if (maxExpiredTime === 0) {
        Promise.all([
          this.cacheService.del(sessionCache.id),
          ...sessionCache.tokens.map((t) => {
            return this.cacheService.del(t.tokenId)
          }),
        ])
      }
      else {
        await this.updateSessionCache(sessionCache)
      }
    }
  }

  async signout(token: string) {
    const payload = await this.tokenService.parseAccessToken(token)
    if (!payload.jti) {
      throw new Error('Token ID is required')
    }
    const { tokenCache, sessionCache } = await this.getCacheByTokenJti(payload.jti)
    const tokenInfo = sessionCache.tokens.find(t => t.tokenId === tokenCache.id)
    sessionCache.tokens = sessionCache.tokens.filter(t => t.tokenId !== tokenCache.id)
    await this.updateSessionCache(sessionCache)
    if (tokenInfo) {
      await this.cacheService.del(tokenInfo.tokenId)
    }
    this.clearSessionCache(sessionCache.id)
  }
}
