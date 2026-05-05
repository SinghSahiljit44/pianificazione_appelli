import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '@server/security';
import { UserRole } from '@server/users';
import { SegreteriaService } from './segreteria.service';
import { CreateSegreteriaDto } from './dto/createsegreteria.dto';
import { UpdateSegreteriaDto } from './dto/updatesegreteria.dto';

@ApiTags('Segreteria APIs')
@Controller('segreteria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SegreteriaController {
  constructor(private readonly service: SegreteriaService) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateSegreteriaDto })
  create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateSegreteriaDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateSegreteriaDto })
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateSegreteriaDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}