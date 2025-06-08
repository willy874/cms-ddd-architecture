import { to } from 'await-to-js'
import { v4 as uuid_v4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { AuthUserService, UserInfo } from './user.service'
import { RegisterDto } from './register.dto'
import { ACCESS_TOKEN_EXPIRED_TIME, REFRESH_TOKEN_EXPIRED_TIME, TokenService } from './token.service'
import { LoginDto } from './login.dto'
import { parseJson, cloneJson } from '@/shared/utils/json'

const MAXIMUM_LOGIN_COUNT = Infinity

interface SessionCache {
  id: string
  user: UserInfo
  tokens: ({
    accessTokenId: string
    refreshTokenId: string
    expiredTime: number
  })[]
}

interface AccessCache {
  accessTokenId: string
  refreshTokenId: string
  sessionCacheId: string
}

interface RefreshCache {
  accessToken: string
  refreshTokenId: string
  sessionCacheId: string
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

  private async getAccessCacheById(id: string) {
    return parseJson<AccessCache>(await this.cacheService.get(id || ''))
  }

  private async getRefreshCacheById(id: string) {
    return parseJson<RefreshCache>(await this.cacheService.get(id))
  }

  private async getSessionCacheById(id: string) {
    return parseJson<SessionCache>(await this.cacheService.get(id))
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

  private async generateAccessToken(accessCache: AccessCache) {
    const accessToken = await this.tokenService.createAccessToken({
      jti: accessCache.accessTokenId,
    })
    await this.cacheService.set(accessCache.accessTokenId, JSON.stringify(accessCache), ACCESS_TOKEN_EXPIRED_TIME)
    return accessToken
  }

  private async generateRefreshToken(refreshCache: RefreshCache) {
    const refreshToken = await this.tokenService.createRefreshToken({
      jti: refreshCache.refreshTokenId,
    })
    await this.cacheService.set(refreshCache.refreshTokenId, JSON.stringify(refreshCache), REFRESH_TOKEN_EXPIRED_TIME)
    return refreshToken
  }

  private async updateSessionCache(sessionCache: SessionCache) {
    return await this.cacheService.set(
      sessionCache.id,
      JSON.stringify(sessionCache),
      REFRESH_TOKEN_EXPIRED_TIME
    )
  }

  private async getCacheByAccessToken(accessToken: string) {
    const payload = await this.tokenService.parseAccessToken(accessToken)
    if (!payload || !payload.jti) {
      throw new Error('Invalid access token')
    }
    const accessCache = await this.getAccessCacheById(payload.jti)
    if (!accessCache || !accessCache.sessionCacheId) {
      throw new Error('Invalid access token')
    }
    const sessionCache = await this.getSessionCacheById(accessCache.sessionCacheId)
    if (!sessionCache) {
      throw new Error('Session cache not found')
    }
    return { sessionCache, accessCache }
  }

  private async getCacheByRefreshToken(refreshToken: string) {
    const payload = await this.tokenService.parseRefreshToken(refreshToken)
    if (!payload || !payload.jti) {
      throw new Error('Invalid refresh token')
    }
    const refreshCache = await this.getRefreshCacheById(payload.jti)
    if (!refreshCache) {
      throw new Error('Invalid refresh token')
    }
    const sessionCache = await this.getSessionCacheById(refreshCache.sessionCacheId)
    if (!sessionCache) {
      throw new Error('Session cache not found')
    }
    return { sessionCache, refreshCache }
  }

  async signin(user: UserInfo) {
    const accessTokenId = uuid_v4()
    const refreshTokenId = uuid_v4()
    const sessionCache = await this.generateSession(user)
    const accessToken = await this.generateAccessToken({
      accessTokenId,
      refreshTokenId,
      sessionCacheId: sessionCache.id,
    })
    const refreshToken = await this.generateRefreshToken({
      accessToken,
      refreshTokenId,
      sessionCacheId: sessionCache.id,
    })
    sessionCache.tokens.push({
      expiredTime: Date.now() + REFRESH_TOKEN_EXPIRED_TIME,
      refreshTokenId,
      accessTokenId,
    })
    while (sessionCache.tokens.length > MAXIMUM_LOGIN_COUNT) {
      const info = sessionCache.tokens.shift()
      if (info) {
        await Promise.all([
          this.cacheService.del(info.accessTokenId),
          this.cacheService.del(info.refreshTokenId),
        ])
      }
    }
    await this.updateSessionCache(sessionCache)
    return {
      accessToken,
      refreshToken,
    }
  }

  async getUserInfoByAccessToken(token: string) {
    const { sessionCache } = await this.getCacheByAccessToken(token)
    return sessionCache.user as unknown
  }

  async refreshToken(accessToken: string, refreshToken: string) {
    const { sessionCache, refreshCache } = await this.getCacheByRefreshToken(refreshToken)
    if (refreshCache.accessToken !== accessToken) {
      throw new Error('Access token does not match the refresh token')
    }
    const index = sessionCache.tokens.findIndex(t => t.refreshTokenId === refreshCache.refreshTokenId)
    if (index >= 0) {
      throw new Error('Refresh token not found in session cache')
    }
    const tokenInfo = cloneJson(sessionCache.tokens[index])
    const newTokenInfo = {
      accessTokenId: uuid_v4(),
      refreshTokenId: uuid_v4(),
      expiredTime: Date.now() + REFRESH_TOKEN_EXPIRED_TIME,
    }
    await Promise.all([
      this.cacheService.del(tokenInfo.accessTokenId),
      this.cacheService.del(tokenInfo.refreshTokenId),
    ])
    const newAccessToken = await this.generateAccessToken({
      accessTokenId: newTokenInfo.accessTokenId,
      refreshTokenId: newTokenInfo.refreshTokenId,
      sessionCacheId: sessionCache.id,
    })
    const newRefreshToken = await this.generateRefreshToken({
      accessToken: newAccessToken,
      refreshTokenId: newTokenInfo.refreshTokenId,
      sessionCacheId: sessionCache.id,
    })
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
            return Promise.all([
              this.cacheService.del(t.accessTokenId),
              this.cacheService.del(t.refreshTokenId),
            ])
          }),
        ])
      }
      else {
        await this.updateSessionCache(sessionCache)
      }
    }
  }

  async signout(token: string) {
    const { sessionCache, accessCache } = await this.getCacheByAccessToken(token)
    const tokenInfo = sessionCache.tokens.find(t => t.refreshTokenId === accessCache.refreshTokenId)
    sessionCache.tokens = sessionCache.tokens.filter(t => t.accessTokenId !== accessCache.accessTokenId)
    await this.updateSessionCache(sessionCache)
    if (tokenInfo) {
      await Promise.all([
        this.cacheService.del(tokenInfo.accessTokenId),
        this.cacheService.del(tokenInfo.refreshTokenId),
      ])
    }
    this.clearSessionCache(sessionCache.id)
  }
}
