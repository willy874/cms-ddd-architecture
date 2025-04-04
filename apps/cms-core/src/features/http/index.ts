import { AxiosInstance, CreateAxiosDefaults } from 'axios'
import { CREATE_AUTH_HTTP_INSTANCE, CREATE_BASE_HTTP_INSTANCE } from '@/constants/query'
import { BASE_URL } from '@/constants/env'
import { authTokenPlugin, createHttpInstance, refreshTokenPlugin } from '@/libs/apis'
import { HttpErrorCode, TOKEN_TYPE } from '@/constants/http'
import { StorageKey } from '@/constants/storage'
import { CoreContextPlugin } from '@/libs/CoreContext'

interface TokenInfo {
  accessToken: string
  refreshToken: string
}

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    const tokenCache = {
      get: () => {
        const accessToken = context.localStorage.getItem(StorageKey.ACCESS_TOKEN)
        const refreshToken = context.localStorage.getItem(StorageKey.REFRESH_TOKEN)
        if (!accessToken) {
          throw new Error('accessToken not found')
        }
        if (!refreshToken) {
          throw new Error('refreshToken not found')
        }
        return { accessToken, refreshToken }
      },
      set: (tokenInfo: TokenInfo) => {
        context.localStorage.setItem(StorageKey.ACCESS_TOKEN, tokenInfo.accessToken)
        context.localStorage.setItem(StorageKey.REFRESH_TOKEN, tokenInfo.refreshToken)
      },
      remove: () => {
        context.localStorage.removeItem(StorageKey.ACCESS_TOKEN)
        context.localStorage.removeItem(StorageKey.REFRESH_TOKEN)
      },
    }
    const getAuthorization = () => {
      const tokenInfo = tokenCache.get()
      return `${TOKEN_TYPE} ${tokenInfo.accessToken}`
    }
    const createBaseHttpConfig = () => ({
      baseURL: BASE_URL,
    } satisfies CreateAxiosDefaults)
    context.queryBus.provide(CREATE_BASE_HTTP_INSTANCE, () => {
      return createHttpInstance(createBaseHttpConfig())
    })
    context.queryBus.provide(CREATE_AUTH_HTTP_INSTANCE, () => {
      return createHttpInstance(
        createBaseHttpConfig(),
        [
          authTokenPlugin({
            getAuthorization,
          }),
          refreshTokenPlugin({
            isTokenExpired: (res) => {
              return res.data.code === HttpErrorCode.TOKEN_EXPIRED
            },
            fetchRefreshToken: (dto: TokenInfo) => {
              return createHttpInstance({
                headers: { Authorization: `${TOKEN_TYPE} ${dto.accessToken}` },
              }).post<TokenInfo>(
                '/refresh-token',
                { refreshToken: dto.refreshToken },
              )
            },
            getRefreshToken: tokenCache.get,
            setRefreshToken: tokenCache.set,
            removeRefreshToken: tokenCache.remove,
          }),
        ])
    })
  }
}

declare module '@/core/custom' {
  export interface CustomQueryBusDict {
    [CREATE_BASE_HTTP_INSTANCE]: () => AxiosInstance
    [CREATE_AUTH_HTTP_INSTANCE]: () => AxiosInstance
  }
}
