import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@server/security';
import { UserRole } from '@server/users';
import type { AuthenticatedUser } from '@server/auth';
import { DocenteService } from './docente.service';
import { CreateDocenteDto } from './dto/createdocente.dto';
import { UpdateDocenteDto } from './dto/updatedocente.dto';

@ApiTags('Docenti APIs')
@Controller('docenti')
@UseGuards(JwtAuthGuard)
export class DocenteController {
  constructor(private readonly service: DocenteService) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.service.getAll();
  }

  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.service.getByUserId(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({ type: CreateDocenteDto }) 
  create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateDocenteDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateDocenteDto }) 
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateDocenteDto
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}