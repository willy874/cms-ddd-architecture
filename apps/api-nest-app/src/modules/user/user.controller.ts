import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { TokenGuard } from '@/shared/token'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/page-query')
  @UseGuards(TokenGuard)
  async getUsers(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('search') search?: string) {
    return {
      code: 200,
      data: await this.userService.queryPage({
        page: page || 1,
        limit: pageSize || 10,
        search: search || '',
      }),
    }
  }

  @Get('/:id')
  @UseGuards(TokenGuard)
  async getUserById(@Param('id') id: number) {
    return {
      code: 200,
      data: await this.userService.getUserById(id),
    }
  }

  @Post('/')
  @UseGuards(TokenGuard)
  async createUser(@Body('username') username: string, @Body('password') password: string) {
    return {
      code: 201,
      data: await this.userService.createUser({ username, password }),
    }
  }

  @Put('/:id')
  @UseGuards(TokenGuard)
  async updateUser(@Param('id') id: number, @Body('username') username: string, @Body('password') password: string) {
    await this.userService.updateUser(id, { username, password })
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @UseGuards(TokenGuard)
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id)
    return {
      code: 200,
    }
  }
}
