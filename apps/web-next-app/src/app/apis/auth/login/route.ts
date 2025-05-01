import { NextRequest, NextResponse } from 'next/server'
import { http, nextRequestToAxiosConfig } from '@/shared/http'
import { z } from 'zod'
import { setToken } from '@/shared/cookie'

const LoginRequestDTOSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
})

const LoginResponseDTOSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export async function POST(request: NextRequest) {
  const response = await http({
    requestSchema: LoginRequestDTOSchema,
    responseSchema: LoginResponseDTOSchema,
  }).request(nextRequestToAxiosConfig(request))
  setToken(response.data)
  return NextResponse.json({
    message: 'Login success!',
  })
}
