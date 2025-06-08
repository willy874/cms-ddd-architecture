import { z } from 'zod'
import { Axios } from 'axios'
import { Injectable } from '@nestjs/common'
import { getEnvironment } from '@packages/shared'
import { LoginDto } from './login.dto'
import { RegisterDto } from './register.dto'

const UserSchema = z.record(z.unknown())

const HttpResultSchema = z.object({
  code: z.number(),
  data: UserSchema,
})

interface HttpResult {
  code: number
  data?: unknown
  message?: string
}

@Injectable()
export class AuthUserService {
  private http: Axios

  constructor() {
    const env = getEnvironment()
    this.http = new Axios({
      baseURL: `http://${env.USER_API_HOST}:${env.USER_API_PORT}/${env.USER_API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
      transformRequest: [
        (data, headers) => {
          if (headers['Content-Type']?.toString().includes('application/json')) {
            return JSON.stringify(data)
          }
        },
      ],
    })
  }

  async loginCheck(dto: LoginDto) {
    const query = {
      username: dto.username,
      password: dto.password,
    }
    const { data } = await this.http.get('/login-check', { params: query })
    const response = JSON.parse(data) as HttpResult
    if (response.code >= 400) {
      throw new Error(response.message)
    }
    try {
      const result = HttpResultSchema.parse(response)
      return result.data as {
        id: number
        [key: string]: unknown
      }
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
    const response = JSON.parse(data) as HttpResult
    if (response.code >= 400) {
      throw new Error(response.message)
    }
    const result = HttpResultSchema.parse(response)
    return result.data
  }
}
