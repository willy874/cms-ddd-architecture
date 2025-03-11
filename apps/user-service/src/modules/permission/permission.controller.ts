import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly appService: PermissionService) {}

  @Get('hello')
  getHello(): string {
    return 'Hello World!';
  }
}
