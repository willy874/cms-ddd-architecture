import { NextRequest } from 'next/server'
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse, isAxiosError, Method } from 'axios'
import { isServer } from '@tanstack/react-query'
import { ApiFetcherArgs, InitClientArgs, initContract } from '@ts-rest/core'
import { z } from 'zod'
import { API_SERVER_URL, IS_PRODUCTION } from '@/constants/env'
import { onTokenExpired } from './refreshToken'

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

const createServerAxios = () => {
  const instance = axios.create({
    baseURL: API_SERVER_URL,
  })
  instance.interceptors.request.use(async (config) => {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  })
  instance.interceptors.response.use(
    null,
    async (error: unknown) => {
      if (!isAxiosError(error)) return
      if (error.response?.status === 401) {
        if (error.response?.data?.message === 'Token expired') {
          return await onTokenExpired(error)
        }
      }
      return Promise.reject(error)
    },
  )
  return instance
}

const createClientAxios = () => {
  const instance = axios.create({})
  return instance
}

interface CreateHttpOptions<RequestDTO extends z.ZodType = z.AnyZodObject, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  axiosOptions?: AxiosRequestConfig<z.infer<RequestDTO>>
  requestSchema?: RequestDTO
  responseSchema?: ResponseDTO
}

interface HttpClient<RequestDTO extends z.ZodType = z.ZodAny, ResponseDTO extends z.ZodType = z.AnyZodObject> {
  request: (config: AxiosRequestConfig<z.infer<RequestDTO>>) => Promise<AxiosResponse<z.infer<ResponseDTO>, z.infer<RequestDTO>>>
}

export function http<RequestDTO extends z.ZodType, ResponseDTO extends z.ZodType>(options: CreateHttpOptions<RequestDTO, ResponseDTO>): HttpClient<RequestDTO, ResponseDTO>
export function http(): HttpClient
export function http(options: CreateHttpOptions = {}): HttpClient {
  const instance = isServer ? createServerAxios() : createClientAxios()
  return {
    request: async (config: AxiosRequestConfig) => {
      const { requestSchema, responseSchema, axiosOptions = {} } = options
      if (requestSchema && !IS_PRODUCTION) {
        const result = requestSchema.safeParse(config.data)
        if (result.success) {
          return result as unknown as AxiosResponse<z.infer<z.ZodAny>>
        }
        else {
          console.warn(result.error.format())
        }
      }
      const response = await instance.request({ ...axiosOptions, ...config })
      if (responseSchema && !IS_PRODUCTION) {
        const result = responseSchema.safeParse(response.data)
        if (result.success) {
          return result as unknown as AxiosResponse<z.infer<z.ZodAny>>
        }
        else {
          console.warn(result.error.format())
        }
      }
      return response
    },
  }
}

export const contract = initContract()

const restApi = async ({ path, method, headers, body }: ApiFetcherArgs) => {
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
  catch (e: unknown) {
    if (isAxiosError(e)) {
      const { response } = e
      if (response) {
        return {
          status: response.status,
          body: response.data,
          headers: new Headers(flattenAxiosConfigHeaders(method, response.headers)),
        }
      }
    }
    throw e
  }
}

export const defaultOptions = {
  baseUrl: '',
  api: restApi,
  validateResponse: true,
} as const satisfies InitClientArgs
