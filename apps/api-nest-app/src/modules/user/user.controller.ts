import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserGuard } from './user.guard'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/page-query')
  @UseGuards(UserGuard)
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
  @UseGuards(UserGuard)
  async getUserById(@Param('id') id: number) {
    return {
      code: 200,
      data: await this.userService.getUserById(id),
    }
  }

  @Post('/')
  @UseGuards(UserGuard)
  async createUser(@Body('username') username: string, @Body('password') password: string) {
    return {
      code: 201,
      data: await this.userService.createUser({ username, password }),
    }
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async updateUser(@Param('id') id: number, @Body('username') username: string, @Body('password') password: string) {
    await this.userService.updateUser(id, { username, password })
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @UseGuards(UserGuard)
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id)
    return {
      code: 200,
    }
  }
}
