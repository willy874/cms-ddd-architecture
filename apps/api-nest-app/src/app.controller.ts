import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller('app')
export class AppController {
  constructor(private configService: ConfigService) {
    console.log('http:', this.configService.get('http'))
    console.log('db:', this.configService.get('db'))
    console.log('cache:', this.configService.get('cache'))
  }

  @Get('hello')
  getHello(): string {
    return 'Hello World!'
  }
}
