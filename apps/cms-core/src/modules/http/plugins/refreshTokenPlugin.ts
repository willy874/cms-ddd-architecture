import { AxiosError, AxiosResponse, isAxiosError, HttpStatusCode } from 'axios'
import { requestQueueFactory } from '../libs/requestQueue'
import { RestAxiosInstance } from '../libs/axios'

interface RefreshTokenParams<Info> {
  isTokenExpired: (res: AxiosResponse) => boolean
  fetchRefreshToken: (dto: Info) => Promise<Info>
  getCache: () => ({
    get: () => Info
    set: (token: Info) => void
    clear: () => void
  })
}

export const refreshTokenPlugin = function<TokenInfo>(params: RefreshTokenParams<TokenInfo>): (instance: RestAxiosInstance) => void {
  const {
    isTokenExpired,
    fetchRefreshToken,
    getCache,
  } = params
  return (instance) => {
    const emitRefreshToken = requestQueueFactory(
      (error: AxiosError, resolve: (res: AxiosResponse) => void, reject) => ({ error, resolve, reject }),
      (queue) => {
        const cache = getCache()
        return fetchRefreshToken(cache.get())
          .then((data) => {
            cache.set(data)
            queue.forEach((ctx) => {
              if (ctx.error.config) {
                instance
                  .request(ctx.error.config)
                  .then(ctx.resolve)
                  .catch(ctx.reject)
              }
              else {
                ctx.reject(ctx.error)
              }
            })
          })
          .catch((err) => {
            cache.clear()
            queue.forEach(ctx => ctx.reject(ctx.error))
            return Promise.reject(err)
          })
      },
    )

    instance.interceptors.response.use(
      null,
      (error) => {
        if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized && isTokenExpired(error.response)) {
          return emitRefreshToken(error)
        }
        return Promise.reject(error)
      },
    )
  }
}
