import { AxiosInstance } from 'axios'
import { ApiFetcher } from './interface'

export const apiFetcherTransform = (instance: AxiosInstance): ApiFetcher => {
  return {
    request: (config) => instance.request({
      url: config.url,
      method: config.method,
      data: config.body,
      params: new URLSearchParams(config.query),
      headers: config.headers,
    }).then((res) => ({
      status: res.status,
      headers: new Headers(res.headers as any),
      data: res.data,
    })),
  }
}
