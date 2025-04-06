import { AxiosInstance, AxiosError, AxiosResponse, isAxiosError, HttpStatusCode } from 'axios'
import { requestQueueFactory } from './requestQueue'

interface RefreshTokenParams<Info> {
  isTokenExpired: (res: AxiosResponse) => boolean
  fetchRefreshToken: (dto: Info) => Promise<AxiosResponse<Info>>
  getRefreshToken: () => Info
  setRefreshToken: (token: Info) => void
  removeRefreshToken: () => void
}

export const refreshTokenPlugin = function<TokenInfo>(params: RefreshTokenParams<TokenInfo>): (instance: AxiosInstance) => void {
  const {
    isTokenExpired,
    fetchRefreshToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
  } = params
  return (instance) => {
    const emitRefreshToken = requestQueueFactory(
      (error: AxiosError, resolve: (res: AxiosResponse) => void, reject) => ({ error, resolve, reject }),
      (queue) => {
        return fetchRefreshToken(getRefreshToken())
          .then((res) => {
            setRefreshToken(res.data)
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
            removeRefreshToken()
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
