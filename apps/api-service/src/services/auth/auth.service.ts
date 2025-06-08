import { to } from 'await-to-js'
import { v4 as uuid_v4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { AuthUserService } from './user.service'
import { RegisterDto } from './register.dto'
import { TokenService } from './token.service'
import { LoginDto } from './login.dto'
import { parseJson } from '@/shared/utils/json'
import { Jwt } from '@packages/shared'

const REFRESH_TOKEN_EXPIRED_TIME = 60 * 60 * 24 * 7 // 7 days

interface UserInfo {
  id: number;
  [k: string]: unknown;
}

interface SessionCache {
  id: string;
  user: UserInfo;
  tokens: ({
    expiredTime: number;
    refreshTokenId: string;
    accessTokenId: string;
  })[],
}

interface AccessCache {
  accessTokenId: string;
  refreshTokenId: string;
  user: UserInfo;
}

interface RefreshCache {
  refreshTokenId: string;
  sessionCacheId: string;
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

  async getAccessCacheByToken(token: string) {
    const [err_1, payload] = await to(this.tokenService.parseAccessToken(token))
    if (err_1 || !payload || !payload.jti) {
      return null
    }
    const [err_2, cacheString] = await to(this.cacheService.get(payload.jti))
    if (err_2 || !cacheString) {
      return null
    }
    try {
      return parseJson<AccessCache>(cacheString)
    } catch (err_3) {
      return null
    }
  }

  async getAccessCacheById(id: string) {
    const [err_1, accessCacheString] = await to(this.cacheService.get(id))
    if (err_1 || !accessCacheString) {
      return null
    }
    try {
      return parseJson<AccessCache>(accessCacheString)
    } catch (err_2) {
      return null
    }
  }

  async getRefreshCacheById(id: string) {
    const [err_1, refreshCacheString] = await to(this.cacheService.get(id))
    if (err_1 || !refreshCacheString) {
      return null
    }
    try {
      return parseJson<RefreshCache>(refreshCacheString)
    } catch (err_2) {
      return null
    }
  }

  async getUserInfoByAccessToken(token: string) {
    const [err_1, payload] = await to(this.getAccessCacheByToken(token))
    if (err_1 || !payload) {
      return null
    }
    return payload.user as unknown
  }

  async getSessionCacheById(id: string) {
    const [err_1, sessionCacheString] = await to(this.cacheService.get(id))
    if (err_1 || !sessionCacheString) {
      return null
    }
    try {
      return parseJson<SessionCache>(sessionCacheString)
    } catch (err_2) {
      return null
    }
  }

  async generateSession(user: UserInfo): Promise<SessionCache> {
    const sessionCacheId = `user:${user.id}`
    const [err_1, sessionCacheString] = await to(this.cacheService.get(sessionCacheId))
    if (err_1) {
      throw new Error('Get user cache failed: ' + err_1.message)
    }
    if (sessionCacheString) {
      try {
        return JSON.parse(sessionCacheString)
      } catch (err_2) {
        throw new Error('Parse user cache failed: ' + err_2.message)
      }
    }
    return {
      id: sessionCacheId,
      user,
      tokens: [],
    }
  }

  async generateAccessToken(accessCache: AccessCache) {
    const [err_1, accessToken] = await to(this.tokenService.createAccessToken({
      jti: accessCache.accessTokenId,
    }))
    if (err_1) {
      throw new Error('Generate access token failed: ' + err_1.message)
    }
    const [err_2] = await to(this.cacheService.set(accessCache.accessTokenId, JSON.stringify(accessCache)))
    if (err_2) {
      throw new Error('Set access token in cache failed: ' + err_2.message)
    }
    return accessToken
  }

  async generateRefreshToken(refreshCache: RefreshCache) {
    const [err_1, refreshToken] = await to(this.tokenService.createRefreshToken({
      jti: refreshCache.refreshTokenId,
    }))
    if (err_1) {
      throw new Error('Generate refresh token failed: ' + err_1.message)
    }
    const [err_2] = await to(this.cacheService.set(refreshCache.refreshTokenId, JSON.stringify(refreshCache)))
    if (err_2) {
      throw new Error('Set refresh token in cache failed: ' + err_2.message)
    }
    return refreshToken
  }

  async signin(user: UserInfo) {
    const accessTokenId = uuid_v4()
    const refreshTokenId = uuid_v4()
    const [err_2, sessionCache] = await to(this.generateSession(user))
    if (err_2) {
      throw new Error('Generate user cache failed: ' + err_2.message)
    }
    sessionCache.tokens.push({
      expiredTime: Date.now() + REFRESH_TOKEN_EXPIRED_TIME,
      refreshTokenId,
      accessTokenId,
    })
    const [err_4, result] = await to(Promise.all([
      this.generateAccessToken({
        accessTokenId,
        refreshTokenId,
        user: sessionCache.user,
      }),
      this.generateRefreshToken({
        refreshTokenId,
        sessionCacheId: sessionCache.id,
      }),
      this.cacheService.set(
        sessionCache.id,
        JSON.stringify(sessionCache),
        REFRESH_TOKEN_EXPIRED_TIME
      )
    ]))
    if (err_4) {
      Promise.all([
        this.cacheService.del(accessTokenId),
        this.cacheService.del(refreshTokenId),
      ])
      throw new Error('Set user cache failed: ' + err_4.message)
    }
    const [accessToken, refreshToken] = result
    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(accessToken: string, refreshToken: string) {
    const [err_1, payload] = await to(this.tokenService.parseRefreshToken(refreshToken))
    if (err_1 || !payload || !payload.jti) {
      if (err_1 instanceof Jwt.ExpiredError) {
        throw new Error('Refresh token expired')
      }
      throw new Error('Invalid refresh token')
    }
    const [err_2, refreshCache] = await to(this.getRefreshCacheById(payload.jti))
    if (err_2 || !refreshCache) {
      throw new Error('Invalid refresh token')
    }
    const [err_3, sessionCache] = await to(this.getSessionCacheById(refreshCache.sessionCacheId))
    if (err_3 || !sessionCache) {
      throw new Error('Session cache not found')
    }
    const index = sessionCache.tokens.findIndex(t => t.refreshTokenId === payload.jti)
    const tokenInfo = sessionCache.tokens[index]
    if (!tokenInfo) {
      throw new Error('Refresh token not found in session cache')
    }
    this.cacheService.del(tokenInfo.accessTokenId)
    this.cacheService.del(tokenInfo.refreshTokenId)
    const accessTokenId = uuid_v4()
    const refreshTokenId = uuid_v4()
    sessionCache.tokens[index].accessTokenId = accessTokenId
    sessionCache.tokens[index].refreshTokenId = refreshTokenId
    const [err_4, tokenResult] = await to(Promise.all([
      this.generateAccessToken({
        accessTokenId,
        refreshTokenId,
        user: sessionCache.user,
      }),
      this.generateRefreshToken({
        refreshTokenId,
        sessionCacheId: sessionCache.id,
      })
    ]))
    if (err_4) {
      this.cacheService.del(accessTokenId)
      this.cacheService.del(refreshTokenId)
      throw new Error('Generate new access token failed: ' + err_4.message)
    }
    const [newAccessToken, newRefreshToken] = tokenResult
    const [err_5] = await to(this.cacheService.set(sessionCache.id, JSON.stringify(sessionCache), Date.now() + REFRESH_TOKEN_EXPIRED_TIME))
    if (err_5) {
      this.cacheService.del(accessTokenId)
      this.cacheService.del(refreshTokenId)
      throw new Error('Update session cache failed: ' + err_5.message)
    }
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  async removeSessionByAccessToken(token: string) {
    const [err_1, accessCache] = await to(this.getAccessCacheByToken(token))
    if (err_1 || !accessCache) {
      return
    }
    const sessionCacheId = `user:${accessCache.user.id}`
    const [err_2, userPayloadCache] = await to(this.getSessionCacheById(sessionCacheId))
    if (err_2 || !userPayloadCache) {
      return
    }
    const tokenInfo = userPayloadCache.tokens.find(t => t.refreshTokenId === accessCache.refreshTokenId)
    if (tokenInfo) {
      Promise.all([
        this.cacheService.del(accessCache.accessTokenId),
        this.cacheService.del(accessCache.refreshTokenId),
      ])
      userPayloadCache.tokens = userPayloadCache.tokens.filter(t => t.refreshTokenId !== accessCache.refreshTokenId)
      if (userPayloadCache.tokens.length === 0) {
        this.cacheService.del(userPayloadCache.id)
      } else {
        const maxLongTime = Math.max(...userPayloadCache.tokens.map(t => t.expiredTime))
        const restTime = Math.max(0, maxLongTime - Date.now())
        if (restTime === 0) {
          Promise.all([
            this.cacheService.del(userPayloadCache.id),
            ...userPayloadCache.tokens.map(t => {
              return Promise.all([
                this.cacheService.del(t.accessTokenId),
                this.cacheService.del(t.refreshTokenId)
              ])
            })
          ])
          
        } else {
          await this.cacheService.set(userPayloadCache.id, JSON.stringify(userPayloadCache), restTime)
        }
      }
    }
  }
}
