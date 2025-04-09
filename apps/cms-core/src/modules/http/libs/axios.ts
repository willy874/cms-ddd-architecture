import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import { HttpInstance } from '../../../libs/http/createFetcher'
import { getRequestBody } from '../../../libs/http/utils'

export const flattenAxiosConfigHeaders = (config: AxiosRequestConfig): Record<string, string> => {
  const headers = config.headers
  if (!headers) {
    return {}
  }
  if (headers instanceof AxiosHeaders) {
    return headers.toJSON() as any
  }
  const lowerMethod = config.method!.toLowerCase?.() || 'get'
  const commonHeaders = headers['common'] || {}
  const methodHeaders = headers[lowerMethod] || {}
  return {
    ...commonHeaders,
    ...methodHeaders,
    ...Object.fromEntries(
      Object.entries(headers).filter(
        ([key]) => !['common', 'get', 'post', 'put', 'patch', 'delete', 'head'].includes(key),
      ),
    ),
  }
}

export const flattenAxiosResponseHeaders = (res: AxiosResponse) => {
  return {
    ...(res.headers.common || {}),
    ...(res.headers[res.config.method!.toLowerCase()] || {}),
    ...res.headers,
  }
}

export type RestAxiosInstance = HttpInstance & AxiosInstance

export const createAxiosInstance = ((config: CreateAxiosDefaults = {}): RestAxiosInstance => {
  const instance = Object.assign(axios.create(config), {
    use: (...plugins: ((inc: AxiosInstance) => void)[]) => {
      plugins.forEach(plugin => {
        plugin(instance)
      })
    },
  })
  const fetcher = instance.request.bind(instance)
  return Object.assign(async (request: Request) => {
    const url = new URL(request.url)
    const res = await fetcher({
      url: url.href,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      data: await getRequestBody(request),
      params: new URLSearchParams(url.search),
      signal: request.signal,
    })
    return new Response(res.data, {
      status: res.status,
      statusText: res.statusText,
      headers: new Headers(flattenAxiosResponseHeaders(res)),
    })
  }, instance)
}) satisfies (() => HttpInstance)
