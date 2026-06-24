import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  UseGuards,
} from '@nestjs/common';
import { ServerUsersService } from './users.service';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from './dto/user-role.enum';
import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@server/security';

@ApiTags('Users APIs')
@Controller('users')
export class ServerUsersController {
  constructor(private serverUsersService: ServerUsersService) {}

  @Get() // GET /users or /users?role=value
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  getUsers(
    @Query('role', new ParseEnumPipe(UserRole, { optional: true }))
    role?: UserRole,
  ) {
    return this.serverUsersService.getUsers(role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser() user: unknown) {
    return user;
  }

  @Get(':id') // GET /users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  getOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.serverUsersService.getOneUser(id);
  }

  @Delete(':id') // DELETE /users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  async removeUser(@Param('id', ParseIntPipe) id: number) {
    const roleOfUserToDelete = (await this.serverUsersService.getOneUser(id))
      .role;
    if (roleOfUserToDelete === UserRole.ADMIN) {
      return { message: 'You cannot delete a user with the ADMIN role.' };
    } else return this.serverUsersService.removeUser(id);
  }
}
