import { Inject, Injectable } from '@nestjs/common'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'
import { TokenService } from '@/shared/token'
import { UserService } from './imports/user'
import { z } from 'zod'

const UserPayloadSchema = z.object({
  uid: z.number(),
  user: z.unknown(),
  permissions: z.array(z.string()),
})

type UserPayload = z.infer<typeof UserPayloadSchema>

const TokenPayloadSchema = UserPayloadSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
})

type TokenPayload = z.infer<typeof TokenPayloadSchema>

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async isAlreadyExistsByUsername(username: string) {
    const user = await this.userService.getUserByName(username)
    return !!user
  }

  async generateTokens(uid: number) {
    const user = await this.userService.getUserById(uid)
    const userPayload = {
      uid,
      user,
      permissions: [],
    } satisfies UserPayload
    const accessToken = this.tokenService.createAccessToken(userPayload)
    const refreshToken = this.tokenService.createRefreshToken(userPayload)
    const tokenPayload = {
      ...userPayload,
      accessToken,
      refreshToken,
    } satisfies TokenPayload
    await Promise.all([
      this.cacheRepository.set(accessToken, JSON.stringify(tokenPayload)),
      this.cacheRepository.set(refreshToken, JSON.stringify(tokenPayload)),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async removeToken(token: string) {
    const userPayload = await this.cacheRepository.get(token) || 'null'
    const payload = TokenPayloadSchema.parse(JSON.parse(userPayload))
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
    return UserPayloadSchema.parse(JSON.parse(value))
  }
}
