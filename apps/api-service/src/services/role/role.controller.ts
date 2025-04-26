import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto } from '@/repositories/dtos'

@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) {}

  @Get('/')
  async getRoles() {
    return {
      code: 200,
      data: await this.roleService.searchQuery(),
    }
  }

  @Get('/:id')
  async getRoleById(@Param('id') id: number) {
    return {
      code: 200,
      data: await this.roleService.getRoleById(id),
    }
  }

  @Post('/')
  @HttpCode(201)
  async createRole(@Body() body: CreateRoleDto) {
    return {
      code: 201,
      data: await this.roleService.insertRole(body),
    }
  }

  @Put('/:id')
  async updateRole(@Param('id') id: number, @Body() body: UpdateRoleDto) {
    await this.roleService.updateRole(id, body)
    return {
      code: 200,
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteRole(@Param('id') id: number) {
    await this.roleService.deleteRole(id)
    return {
      code: 204,
    }
  }
}
