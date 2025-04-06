import { z } from 'zod'
import { Axios } from 'axios'
import { Injectable } from '@nestjs/common'
import { getEnvironment } from '@packages/shared'
import { LoginDto } from './login.dto'
import { RegisterDto } from './register.dto'

const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
})

const HttpResultSchema = z.object({
  code: z.number(),
  data: UserSchema,
})

@Injectable()
export class AuthUserService {
  private http: Axios

  constructor() {
    const env = getEnvironment()
    this.http = new Axios({
      baseURL: `http://${env.USER_API_HOST}:${env.USER_API_PORT}/${env.USER_API_PREFIX}`,
    })
  }

  async loginCheck(dto: LoginDto) {
    const query = {
      username: dto.username,
      password: dto.password,
    }
    const { data } = await this.http.get('/login-check', { params: query })
    try {
      const result = HttpResultSchema.parse(JSON.parse(data))
      return result.data
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation error
      }
      return null
    }
  }

  async getUserById(id: number) {
    const { data } = await this.http.get(`/${id}`)
    const res = HttpResultSchema.parse(JSON.parse(data))
    return res.data
  }

  async insertUser(dto: RegisterDto) {
    const command = {
      username: dto.username,
      password: dto.password,
      roles: [],
    }
    const { data } = await this.http.post('/', command)
    const result = HttpResultSchema.parse(JSON.parse(data))
    return result.data
  }
}
