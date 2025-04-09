import { z } from 'zod'
import { HttpMethod, RestResource, ZodSchema } from './defineResource'
import { bodyHandler, createHeaders, responseHandler } from './utils'
import { createHttpUrl, ExtractParams } from './url'
import { querySafetyCheck, schemaSafetyCheck } from './zod'

export type RequestConfig = RequestInit & { url: string }

export interface HttpInstance {
  (config: RequestConfig): Promise<Response>
}

type InferParams<T extends string> =
  ExtractParams<T> extends never
    ? { params?: {} }
    : { params?: Record<ExtractParams<T>, string | number | string[]> }

type InferBody<T> =
  T extends ZodSchema
    ? { body?: z.infer<T> }
    : { body?: {} }

type InferQuery<T> =
  T extends ZodSchema
    ? { query?: z.infer<T> | URLSearchParams }
    : { query?: {} }

export class HttpError extends Error {
  public config?: RequestConfig
  public request?: Request
  public response?: Response
  public resource?: RestResource<any, any>
  public status?: number
  constructor(
    error: Error,
  ) {
    super(error.message)
    this.name = 'HttpError'
    this.stack = error.stack
  }
}

interface HttpRestFetcher<
  Url extends string,
  Res extends ZodSchema,
  Query extends ZodSchema,
  Body extends ZodSchema,
> {
  (options?: {
    signal?: AbortSignal
    headers?: HeadersInit
  } & InferBody<Body> & InferParams<Url> & InferQuery<Query>
  ): Promise<z.infer<Res>>
}

export interface CreateFetcherOptions {
  baseURL?: string
  headers?: HeadersInit
  createInstance?: () => HttpInstance
  onBeforeRequest?: (config: RequestConfig) => void
  onRequestError?: (error: Error) => void
  onResponseError?: (error: Error) => void
}

export function createFetcher<
  Url extends string,
  Method extends HttpMethod,
  Res extends ZodSchema,
  Query extends ZodSchema,
  Body extends ZodSchema,
>(
  resource: RestResource<Url, Method, Res, Query, Body>,
  options: CreateFetcherOptions = {},
): HttpRestFetcher<Url, Res, Query, Body> {
  const instance = options.createInstance?.()
  return async (config) => {
    let requestConfig: RequestConfig
    let request: Request
    let response: Response
    let status: number
    try {
      const responseSchema = resource.response
      const bodySchema = resource.body
      const querySchema = resource.query
      if (bodySchema) {
        schemaSafetyCheck(bodySchema, config?.body)
      }
      const query = config?.query instanceof URLSearchParams ? config.query : new URLSearchParams(config?.query)
      if (querySchema) {
        querySafetyCheck(querySchema, config?.query)
      }
      const headers = createHeaders(options.headers, resource.headers, config?.headers)
      requestConfig = {
        url: createHttpUrl({
          baseUrl: options.baseURL,
          url: resource.url,
          params: config?.params as any,
          query,
        }),
        method: resource.method,
        headers,
        body: bodyHandler(config?.body, headers),
        signal: config?.signal,
      }

      options.onBeforeRequest?.(requestConfig)
      response = await (() => {
        if (instance) {
          return instance(requestConfig)
        }
        const { url, ...init } = requestConfig
        request = new Request(url, init)
        return window.fetch(request)
      })()
      if (response.status >= 400) {
        throw new Error('Response failed')
      }
      const responseData = responseHandler(response, {
        json: responseSchema ? (data) => schemaSafetyCheck(responseSchema, data) : undefined,
      })
      return responseData as z.infer<Res>
    }
    catch (error) {
      const httpError = new HttpError(error as Error)
      httpError.resource = resource
      httpError.config = requestConfig!
      httpError.request = request!
      httpError.response = response!
      httpError.status = status!
      if (httpError.response) {
        options.onResponseError?.(error as Error)
      }
      else {
        options.onRequestError?.(httpError)
      }
      throw httpError
    }
  }
}
