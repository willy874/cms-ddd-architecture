import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseGuards, HttpCode } from '@nestjs/common'
import { TokenGuard } from '@/shared/token'
import { QueryParams } from '@/utils/types'
import { UserService } from './user.service'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('')
  @UseGuards(TokenGuard)
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
  @UseGuards(TokenGuard)
  async searchUsers(@Body() body: QueryParams) {
    return {
      code: 200,
      data: this.userService.createCache(body),
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
  @HttpCode(201)
  @UseGuards(TokenGuard)
  async createUser(@Body() body: CreateUserDto) {
    return {
      code: 201,
      data: await this.userService.createUser(body),
    }
  }

  @Put('/:id')
  @UseGuards(TokenGuard)
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    await this.userService.updateUser(id, body)
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(TokenGuard)
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id)
    return {
      code: 204,
    }
  }
}
