import { AxiosInstance, AxiosResponse } from 'axios'
import { CREATE_AUTH_HTTP_INSTANCE, CREATE_BASE_HTTP_INSTANCE } from '@/constants/query'
import { authTokenPlugin, createHttpInstance, refreshTokenPlugin } from '@/libs/apis'
import type { CoreContext } from '@/libs/CoreContext'

const TOKEN_TYPE = 'Bearer'

interface TokenInfo {
  accessToken: string
  refreshToken: string
}

export function contextHttpPlugin(): (context: CoreContext) => void {
  return (context) => {
    let tokenInfo: TokenInfo | null = null
    const createBaseHttpConfig = () => ({})
    context.queryBus.provide(CREATE_BASE_HTTP_INSTANCE, () => {
      return createHttpInstance(createBaseHttpConfig())
    })
    context.queryBus.provide(CREATE_AUTH_HTTP_INSTANCE, () => {
      return createHttpInstance(
        createBaseHttpConfig(),
        [
          authTokenPlugin({
            getAuthorization: () => {
              if (!tokenInfo) {
                throw new Error('Token not found')
              }
              return `${TOKEN_TYPE} ${tokenInfo.accessToken}`
            },
          }),
          refreshTokenPlugin({
            isTokenExpired: (res: AxiosResponse) => {
              return res.data.code === 'TOKEN_EXPIRED'
            },
            fetchRefreshToken: (dto: TokenInfo) => {
              return createHttpInstance({
                headers: { Authorization: `${TOKEN_TYPE} ${dto.accessToken}` },
              }).post<TokenInfo>(
                '/refresh-token',
                { refreshToken: dto.refreshToken },
              )
            },
            getRefreshToken: () => {
              if (!tokenInfo) {
                throw new Error('Token not found')
              }
              return tokenInfo
            },
            setRefreshToken: (token: TokenInfo) => {
              tokenInfo = token
            },
            removeRefreshToken: () => {
              tokenInfo = null
            },
          }),
        ])
    })
  }
}

declare module '../core/PortalContext' {
  export interface CustomQueryBusDict {
    [CREATE_BASE_HTTP_INSTANCE]: () => AxiosInstance
    [CREATE_AUTH_HTTP_INSTANCE]: () => AxiosInstance
  }
}
