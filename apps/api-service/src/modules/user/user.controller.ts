import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpCode } from '@nestjs/common'
import { QueryParams } from '@/shared/types'
import { UserService } from './user.service'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'
import { LoginDto } from './login.dto'
import { UserAlreadyExistsException } from '@/shared/errors'

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
    @Body() body: LoginDto,
  ) {
    return {
      code: 200,
      data: await this.userService.getUserByNameAndPassword({
        username: body.username,
        password: body.password,
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
    const user = await this.userService.getUserNamesByName(body.username)
    if (user) {
      throw new UserAlreadyExistsException()
    }
    const result = await this.userService.insertUser(body)
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
