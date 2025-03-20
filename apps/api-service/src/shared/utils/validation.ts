import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value)
    }
    catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.errors)
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
