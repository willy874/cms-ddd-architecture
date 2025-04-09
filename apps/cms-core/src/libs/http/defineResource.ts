import { z } from 'zod'

type AnyZodObject = z.ZodObject<z.ZodRawShape>
type AnyZodEffect = z.ZodEffects<AnyZodObject>
export type ZodSchema = AnyZodObject | AnyZodEffect

interface BaseHttpRestResource {
  url: string
  method: string
  headers?: HeadersInit
  response?: ZodSchema
}

export type HttpMethod = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface RestResource<
  Url extends string,
  Method extends HttpMethod,
  Res extends ZodSchema = ZodSchema,
  Query extends ZodSchema = ZodSchema,
  Body extends ZodSchema = ZodSchema,
> extends BaseHttpRestResource {
  url: Url
  method: Method
  headers?: HeadersInit
  response?: Res
  query?: Query
  body?: Body
}

export function defineRestResource<
  Url extends string,
  Method extends HttpMethod,
  Res extends ZodSchema = ZodSchema,
  Query extends ZodSchema = ZodSchema,
  Body extends ZodSchema = ZodSchema,
>(
  resource: RestResource<Url, Method, Res, Query, Body>,
): RestResource<Url, Method, Res, Query, Body> {
  return resource
}
