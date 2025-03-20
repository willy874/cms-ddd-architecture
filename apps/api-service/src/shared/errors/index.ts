import { HttpException, HttpStatus } from '@nestjs/common'
import { z, ZodError } from 'zod'

export * from './auth'

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super({
      code: HttpStatus.BAD_REQUEST,
      message: 'User already exists',
    }, HttpStatus.BAD_REQUEST)
  }
}

class ValidateException extends HttpException {
  constructor(data: Record<string, any>) {
    super({
      code: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      ...data,
    }, HttpStatus.BAD_REQUEST)
  }
}

export async function schemaValidate<T extends z.ZodObject<any, any>>(schema: T, value: unknown): Promise<z.infer<T>> {
  try {
    return schema.parseAsync(value)
  }
  catch (error) {
    if (error instanceof ZodError) {
      throw new ValidateException({
        issues: error.issues,
      })
    }
    throw error
  }
}
