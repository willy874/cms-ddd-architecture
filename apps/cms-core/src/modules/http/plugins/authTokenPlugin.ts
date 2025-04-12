import { isAxiosError, HttpStatusCode, AxiosInstance } from 'axios'

interface AuthTokenParams {
  getAuthorization: () => string
  onUnauthorized?: () => void
}

export const authTokenPlugin = function (params: AuthTokenParams): (instance: AxiosInstance) => void {
  const { getAuthorization, onUnauthorized } = params
  return (instance) => {
    instance.interceptors.request.use((config) => {
      try {
        config.headers['Authorization'] = getAuthorization()
      }
      catch {
        return Promise.reject(new Error('Authorization headers not found.'))
      }
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
