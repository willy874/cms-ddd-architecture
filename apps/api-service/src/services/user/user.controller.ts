import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpCode } from '@nestjs/common'
import { hash } from '@packages/shared'
import { QueryParams } from '@/shared/types'
import { UserAlreadyExistsException } from '@/shared/errors'
import { CreateUserDto, UpdateUserDto } from '@/repositories/dtos'
import { LoginDto } from '@/repositories/dtos'
import { UserService } from './user.service'

const asArray = <T>(value?: T | T[]) => Array.isArray(value) ? [...value] : (value ? [value] : [])

const mergeArray = <T>(value: T | T[], defaultValue: T[]) => Array.isArray(value) ? [...value] : defaultValue

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('/query')
  async getPageUsers(
    @Query() query: QueryParams,
  ) {
    query.exclude = mergeArray(asArray(query.exclude), ['password'])
    return {
      code: 200,
      data: await this.userService.pageQuery(query),
    }
  }

  @Get('/query/:token')
  async getUsersByToken(
    @Param('token') token: string,
  ) {
    return {
      code: 200,
      data: await this.userService.queryByToken(token),
    }
  }

  @Post('/query')
  async queryUsers(@Body() body: QueryParams) {
    body.exclude = mergeArray(asArray(body.exclude), ['password'])
    const data = await this.userService.createCache(body, p => this.userService.pageQuery(p))
    return {
      code: 200,
      data,
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
