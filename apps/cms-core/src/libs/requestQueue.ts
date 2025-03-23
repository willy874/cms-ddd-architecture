import axios, { AxiosInstance, AxiosError, AxiosResponse, isAxiosError } from 'axios'

export function requestQueueFactory<Context, Req, Res>(
  createContext: (req: Req, resolve: (res: Res) => void, reject: (error: unknown) => void) => Context,
  resolveQueue: (queue: Context[]) => Promise<void>,
): (request: Req) => Promise<Res> {
  const context = {
    queue: [] as Context[],
    isRefreshing: false,
  }
  return (request) => {
    if (!context.isRefreshing) {
      resolveQueue(context.queue)
        .finally(() => {
          context.isRefreshing = false
          context.queue = []
        })
      context.isRefreshing = true
    }
    return new Promise<Res>((resolve, reject) => {
      context.queue.push(createContext(request, resolve, reject))
    })
  }
}

interface TokenInfo {
  accessToken: string
  refreshToken: string
}

let tokenInfo: TokenInfo | null = null
const fetchRefreshToken = (dto: TokenInfo) => axios.post<TokenInfo>(
  '/refresh-token',
  { refreshToken: dto.refreshToken },
  { headers: { Authorization: `Bearer ${dto.accessToken}` } },
)
const getRefreshToken = () => {
  if (!tokenInfo) {
    throw new Error('Token not found')
  }
  return tokenInfo
}
const setRefreshToken = (token: TokenInfo) => {
  tokenInfo = token
}
const removeRefreshToken = () => {}

const isTokenExpired = (res: AxiosResponse) => res.data.code === 'TOKEN_EXPIRED'

export const refreshTokenPlugin = (instance: AxiosInstance) => {
  const emitRefreshToken = requestQueueFactory(
    (error: AxiosError, resolve: (res: AxiosResponse) => void, reject) => ({ error, resolve, reject }),
    (queue) => {
      return fetchRefreshToken(getRefreshToken())
        .then((res) => {
          setRefreshToken(res.data)
          queue.forEach((ctx) => {
            instance
              .request({ ...ctx.error.config })
              .then(ctx.resolve)
              .catch(ctx.reject)
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
      if (isAxiosError(error) && error.response?.status === 401 && isTokenExpired(error.response)) {
        return emitRefreshToken(error)
      }
      return Promise.reject(error)
    },
  )
}
