import { z } from 'zod'
import { ZodSchema } from './defineResource'
import { entriesToRecord } from './utils'

export function schemaSafetyCheck<T extends ZodSchema>(schema: T, value: unknown): z.infer<T> {
  if (schema instanceof z.ZodObject || schema instanceof z.ZodEffects) {
    const result = schema.safeParse(value)
    if (result.success) {
      return value as z.infer<ZodSchema>
    }
    if (result.error) {
      console.warn('Schema validation failed:', result.error.errors)
      return value as z.infer<ZodSchema>
    }
  }
  throw new Error('Schema is not a valid Zod schema')
}

export function querySafetyCheck(schema: ZodSchema, value?: object | URLSearchParams): URLSearchParams {
  if (!value) {
    return new URLSearchParams()
  }
  if (value instanceof URLSearchParams) {
    schemaSafetyCheck(schema, entriesToRecord([...value.entries()]))
    return value
  }
  schemaSafetyCheck(schema, value)
  return new URLSearchParams(value as Record<string, string>)
}
