import axios from 'axios'
import { StorageKey } from '@/constants/storage'
import { HttpErrorCode } from '@/constants/http'
import { BASE_URL } from '@/constants/env'
import { GET_BASE_FETCHER_CONFIG, GET_AUTH_FETCHER_CONFIG } from '@/constants/query'
import { CoreContextPlugin } from '@/libs/CoreContext'
import { CreateFetcherOptions } from '@/libs/http'
import { createHttpInstanceFactor } from './libs/axios'
import { refreshTokenPlugin } from './plugins/refreshTokenPlugin'
import { authTokenPlugin } from './plugins/authTokenPlugin'

interface TokenInfo {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export const MODULE_NAME = 'cms_core/http'

export function contextPlugin(): CoreContextPlugin {
  return (context) => {
    const tokenCache = {
      get: () => {
        const accessToken = context.localStorage.getItem(StorageKey.ACCESS_TOKEN)
        const refreshToken = context.localStorage.getItem(StorageKey.REFRESH_TOKEN)
        const tokenType = context.localStorage.getItem(StorageKey.TOKEN_TYPE)
        if (!accessToken) {
          throw new Error('accessToken not found')
        }
        if (!refreshToken) {
          throw new Error('refreshToken not found')
        }
        if (!tokenType) {
          throw new Error('tokenType not found')
        }
        return { accessToken, refreshToken, tokenType }
      },
      set: (tokenInfo: TokenInfo) => {
        context.localStorage.setItem(StorageKey.ACCESS_TOKEN, tokenInfo.accessToken)
        context.localStorage.setItem(StorageKey.REFRESH_TOKEN, tokenInfo.refreshToken)
        context.localStorage.setItem(StorageKey.TOKEN_TYPE, tokenInfo.tokenType)
      },
      clear: () => {
        context.localStorage.removeItem(StorageKey.ACCESS_TOKEN)
        context.localStorage.removeItem(StorageKey.REFRESH_TOKEN)
        context.localStorage.removeItem(StorageKey.TOKEN_TYPE)
      },
    }

    const getAuthorization = () => {
      const tokenInfo = tokenCache.get()
      return `${tokenInfo.tokenType} ${tokenInfo.accessToken}`
    }
    const baseConfig = {
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    context.queryBus.provide(GET_BASE_FETCHER_CONFIG, () => ({
      ...baseConfig,
      createInstance: createHttpInstanceFactor(axios.create()),
    }))
    context.queryBus.provide(GET_AUTH_FETCHER_CONFIG, () => ({
      ...baseConfig,
      createInstance: () => {
        const instance = axios.create()
        const authPlugin = authTokenPlugin({
          getAuthorization,
        })
        const refreshPlugin = refreshTokenPlugin({
          isTokenExpired: (res) => {
            return res.data.code === HttpErrorCode.TOKEN_EXPIRED
          },
          fetchRefreshToken: (dto) => {
            const inc = axios.create()
            authPlugin(inc)
            return inc.post(
              '/refresh-token',
              { refreshToken: dto.refreshToken },
              {
                baseURL: BASE_URL,
                headers: { Authorization: `${dto.tokenType} ${dto.accessToken}` },
              },
            ).then((res) => res.data)
          },
          getCache: () => tokenCache,
        })
        authPlugin(instance)
        refreshPlugin(instance)
        const createHttpInstance = createHttpInstanceFactor(instance)
        return createHttpInstance()
      },
    }))

    return {
      name: MODULE_NAME,
    }
  }
}

declare module '@/modules/cqrs' {
  export interface CustomQueryBusDict {
    [GET_BASE_FETCHER_CONFIG]: () => CreateFetcherOptions
    [GET_AUTH_FETCHER_CONFIG]: () => CreateFetcherOptions
  }
}
