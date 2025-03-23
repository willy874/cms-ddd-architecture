import { AxiosInstance, isAxiosError, HttpStatusCode } from 'axios'

interface AuthTokenParams {
  getAuthorization: () => string
  onUnauthorized?: () => void
}

export const authTokenPlugin = function (params: AuthTokenParams): (instance: AxiosInstance) => void {
  const { getAuthorization, onUnauthorized } = params
  return (instance) => {
    instance.interceptors.request.use((config) => {
      config.headers['Authorization'] = getAuthorization()
      return Promise.resolve(config)
    })
    instance.interceptors.response.use(
      null,
      (error) => {
        if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
          onUnauthorized?.()
          return Promise.reject(error)
        }
        return Promise.reject(error)
      },
    )
  }
}
