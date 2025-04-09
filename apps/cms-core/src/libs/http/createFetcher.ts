import { z } from 'zod'
import { HttpMethod, RestResource, ZodSchema } from './defineResource'
import { bodyHandler, createHeaders, responseHandler } from './utils'
import { createHttpUrl, ExtractParams } from './url'
import { querySafetyCheck, schemaSafetyCheck } from './zod'

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
  public request?: Request
  public response?: Response
  public resource?: RestResource<any, any>
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export interface HttpInstance {
  (config: Request): Promise<Response>
}

interface HttpRestFetcher<
  Url extends string,
  Res extends ZodSchema,
  Query extends ZodSchema,
  Body extends ZodSchema,
> {
  (options: {
    signal?: AbortSignal
    headers?: HeadersInit
  } & InferBody<Body> & InferParams<Url> & InferQuery<Query>
  ): Promise<z.infer<Res>>
}

export interface CreateFetcherOptions {
  baseURL?: string
  headers?: HeadersInit
  createInstance?: () => HttpInstance
  onBeforeRequest?: (config: Request) => void
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
    let request: Request
    let response: Response
    let status: number
    try {
      const responseSchema = resource.response
      const bodySchema = resource.body
      const querySchema = resource.query
      if (bodySchema) {
        schemaSafetyCheck(bodySchema, config.body)
      }
      const query = config.query instanceof URLSearchParams ? config.query : new URLSearchParams(config.query)
      if (querySchema) {
        querySafetyCheck(querySchema, config.query)
      }
      const headers = createHeaders(options.headers, resource.headers, config.headers)
      request = new Request(
        createHttpUrl({
          baseUrl: options.baseURL,
          url: resource.url,
          params: config.params as any,
          query,
        })
        , {
          method: resource.method,
          headers,
          body: bodyHandler(config.body, headers),
          signal: config.signal,
        })
      options.onBeforeRequest?.(request)
      response = await (instance || window.fetch)(request)
      if (response.status >= 400) {
        throw new Error('Response failed')
      }
      const responseData = responseHandler(response, {
        json: responseSchema ? (data) => schemaSafetyCheck(responseSchema, data) : undefined,
      })
      return responseData as z.infer<Res>
    }
    catch (err) {
      const error = err as Error
      const httpError = new HttpError(error.message)
      httpError.resource = resource
      httpError.request = request!
      httpError.response = response!
      httpError.status = status!
      if (httpError.response) {
        options.onResponseError?.(error)
      }
      else {
        options.onRequestError?.(httpError)
      }
      throw httpError
    }
  }
}
