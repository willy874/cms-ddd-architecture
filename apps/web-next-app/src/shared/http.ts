import { NextRequest } from 'next/server'
import { AxiosHeaders, AxiosRequestConfig } from 'axios'

export function nextRequestToAxiosConfig(req: NextRequest): AxiosRequestConfig {
  const { method, headers, body, url } = req
  const urlObj = new URL(url)
  return {
    url: `${urlObj.pathname}${urlObj.search}`,
    method,
    headers: Object.fromEntries(headers.entries()),
    data: body,
  }
}

export const flattenAxiosConfigHeaders = (method: string, headers: AxiosRequestConfig['headers']): Record<string, string> => {
  if (!headers) {
    return {}
  }
  if (headers instanceof AxiosHeaders) {
    return headers.toJSON() as unknown as Record<string, string>
  }
  const lowerMethod = method!.toLowerCase?.() || 'get'
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
