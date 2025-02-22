import { ArgumentMetadata, PipeTransform, ValidationPipe } from '@nestjs/common'

export class ValidationPipePlugin implements PipeTransform {
  current = new ValidationPipe()
  transform(value: unknown, metadata: ArgumentMetadata) {
    return this.current.transform(value, metadata)
  }
}
