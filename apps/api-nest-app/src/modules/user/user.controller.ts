import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards, HttpCode } from '@nestjs/common'
import { QueryParams } from '@/utils/types'
import { UserService } from './user.service'
import { UserGuard } from './user.guard'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('')
  @UseGuards(UserGuard)
  async getUsers(
    @Query() query: QueryParams & { queryToken?: string },
  ) {
    const { queryToken, ...restQuery } = query
    if (queryToken) {
      return {
        code: 200,
        data: await this.userService.queryByToken(queryToken),
      }
    }
    return {
      code: 200,
      data: await this.userService.queryPage(restQuery),
    }
  }

  @Post('/search')
  @UseGuards(UserGuard)
  async searchUsers(@Body() body: QueryParams) {
    return {
      code: 200,
      data: this.userService.createCache(body),
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
  @HttpCode(201)
  @UseGuards(UserGuard)
  async createUser(@Body() body: CreateUserDto) {
    return {
      code: 201,
      data: await this.userService.createUser(body),
    }
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    await this.userService.updateUser(id, body)
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(UserGuard)
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id)
    return {
      code: 204,
    }
  }
}
