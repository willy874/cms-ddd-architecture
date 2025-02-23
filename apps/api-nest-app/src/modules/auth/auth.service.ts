import { Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { TokenService } from '@/shared/token'
import { UserService } from './imports/user'
import { z } from 'zod'

const JwtPayloadSchema = z.object({
  uid: z.number(),
  permissions: z.array(z.string()),
})

type JwtPayload = z.infer<typeof JwtPayloadSchema>

const TokenPayloadSchema = z.object({
  uid: z.number(),
  accessToken: z.string(),
  refreshToken: z.string(),
})

type TokenPayload = z.infer<typeof TokenPayloadSchema>

const UserPayloadSchema = z.object({
  user: z.unknown(),
  permissions: z.array(z.string()),
})

type UserPayload = z.infer<typeof UserPayloadSchema>

type CachePayload = TokenPayload & UserPayload

@Injectable()
export class AuthService {
  constructor(
    private cacheService: CacheService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  getUserByNameAndPassword(username: string, password: string) {
    return this.userService.getUserByNameAndPassword(username, password)
  }

  createUser(payload: { username: string, password: string }) {
    this.userService.createUser(payload)
  }

  async isAlreadyExistsByUsername(username: string) {
    const user = await this.userService.getUserByName(username)
    return !!user
  }

  async generateTokens(uid: number) {
    const user = await this.userService.getUserById(uid)
    const jwtPayload = JwtPayloadSchema.parse({
      uid,
      permissions: [],
    } satisfies JwtPayload)
    const accessToken = this.tokenService.createAccessToken(jwtPayload)
    const refreshToken = this.tokenService.createRefreshToken(jwtPayload)
    const cachePayload = {
      user,
      permissions: jwtPayload.permissions,
      accessToken,
      refreshToken,
    } satisfies CachePayload
    await Promise.all([
      this.cacheService.set(accessToken, JSON.stringify(cachePayload)),
      this.cacheService.set(refreshToken, JSON.stringify(cachePayload)),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async removeToken(token: string) {
    const cachePayload = await this.cacheService.get(token) || 'null'
    if (cachePayload) {
      const tokenPayload = TokenPayloadSchema.parse(JSON.parse(cachePayload))
      await Promise.all([
        this.cacheService.del(tokenPayload.accessToken),
        this.cacheService.del(tokenPayload.refreshToken),
      ])
      return true
    }
    return false
  }

  async getTokenPayloadByToken(token: string) {
    const value = await this.cacheService.get(token)
    if (!value) {
      return null
    }
    return TokenPayloadSchema.parse(JSON.parse(value))
  }

  async getUserPayloadByToken(token: string) {
    const value = await this.cacheService.get(token)
    if (!value) {
      return null
    }
    return UserPayloadSchema.parse(JSON.parse(value))
  }
}
