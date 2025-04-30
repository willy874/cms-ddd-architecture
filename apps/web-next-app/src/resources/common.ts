import { isServer } from '@tanstack/react-query'
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, isAxiosError, Method } from 'axios'
import { NextRequest } from 'next/server'
import { ApiFetcherArgs, initContract } from '@ts-rest/core'

export const createServerAxios = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:8765',
  })
  return instance
}

export const createClientAxios = () => {
  const instance = axios.create({})
  return instance
}

export const http = () => {
  const instance = isServer ? createServerAxios() : createClientAxios()
  return {
    request: (config: AxiosRequestConfig) => {
      return instance.request(config)
    },
  }
}

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

export const contract = initContract()

const flattenAxiosConfigHeaders = (method: string, headers: AxiosRequestConfig['headers']): Record<string, string> => {
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

export const restApi = async ({ path, method, headers, body }: ApiFetcherArgs) => {
  try {
    const result = await http().request({
      method: method as Method,
      url: path,
      headers,
      data: body,
    })
    return {
      status: result.status,
      body: result.data,
      headers: new Headers(flattenAxiosConfigHeaders(method, result.headers)),
    }
  }
  catch (e: Error | AxiosError | unknown) {
    if (isAxiosError(e)) {
      const error = e as AxiosError
      const response = error.response as AxiosResponse
      return {
        status: response.status,
        body: response.data,
        headers: new Headers(flattenAxiosConfigHeaders(method, response.headers)),
      }
    }
    throw e
  }
}
