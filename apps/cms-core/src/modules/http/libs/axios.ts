import { AxiosHeaders, AxiosInstance, AxiosRequestConfig, AxiosResponse, GenericAbortSignal } from 'axios'
import { HttpInstance, RequestConfig } from '@/libs/http'

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

const transformDataToBodyByHeader = (data: unknown, headers: Headers): BodyInit => {
  if (headers.get('Content-Type')?.includes('application/json')) {
    return JSON.stringify(data as object)
  }
  if (headers.get('Content-Type')?.includes('text/plain')) {
    return data as string
  }
  if (data instanceof Blob) {
    return data
  }
  if (typeof data === 'string') {
    return data
  }
  return data as BodyInit
}
export function createHttpInstanceFactor(instance: AxiosInstance): (() => HttpInstance) {
  return () => {
    const fetcher = instance.request.bind(instance)
    return async (request: RequestConfig) => {
      const url = new URL(request.url)
      const fetcherConfig = {
        url: url.href,
        method: request.method,
        headers: Object.fromEntries(new Headers(request.headers).entries()),
        data: request.body,
        params: new URLSearchParams(url.search),
        signal: (request.signal || undefined) as GenericAbortSignal,
      } satisfies AxiosRequestConfig
      const res = await fetcher(fetcherConfig)
      const headers = new Headers(flattenAxiosResponseHeaders(res))
      const body = transformDataToBodyByHeader(res.data, headers)
      return new Response(
        body,
        {
          status: res.status,
          statusText: res.statusText,
          headers,
        })
    }
  }
}
