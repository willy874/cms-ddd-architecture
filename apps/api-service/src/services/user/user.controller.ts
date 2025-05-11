import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpCode } from '@nestjs/common'
import { hash } from '@packages/shared'
import { QueryParams } from '@/shared/types'
import { UserAlreadyExistsException } from '@/shared/errors'
import { CreateUserDto, UpdateUserDto } from '@/repositories/dtos'
import { LoginDto } from '@/repositories/dtos'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('/')
  async getPageUsers(
    @Query() query: QueryParams,
  ) {
    return {
      code: 200,
      data: await this.userService.pageQuery(query),
    }
  }

  @Get('/login-check')
  async getUserByLogin(
    @Query() query: LoginDto,
  ) {
    return {
      code: 200,
      data: await this.userService.getUserByNameAndPassword({
        username: query.username,
        password: query.password,
      }),
    }
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return {
      code: 200,
      data: await this.userService.getUserById(id),
    }
  }

  @Post('/')
  @HttpCode(201)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.getUserByName(body.username)
    if (user) {
      throw new UserAlreadyExistsException()
    }
    const result = await this.userService.insertUser({
      username: body.username,
      password: hash(body.password),
      roles: body.roles,
    })
    return {
      code: 201,
      data: result,
    }
  }

  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    await this.userService.updateUser(id, body)
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id)
    return {
      code: 204,
    }
  }
}
