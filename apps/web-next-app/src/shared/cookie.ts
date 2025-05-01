import { IS_PRODUCTION } from '@/constants/env'
import { isServer } from '@tanstack/react-query'

interface SetTokenParams {
  accessToken: string
  refreshToken: string
}

export async function setToken({ accessToken, refreshToken }: SetTokenParams) {
  if (!isServer) {
    throw new Error('setToken can only be called on the server side')
  }
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    maxAge: 60 * 15, // 15分鐘
    path: '/',
    secure: IS_PRODUCTION,
  })
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
    secure: IS_PRODUCTION,
  })
}
