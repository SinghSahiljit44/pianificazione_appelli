import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ufficio: { type: 'string', example: 'Ufficio Didattica' },
        telefonoInterno: { type: 'string', example: '0321' },
        userId: { type: 'number', example: 1 },
      },
      required: ['ufficio', 'userId'],
    },
  })
  create(@Body() data: CreateSegreteriaDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ufficio: { type: 'string', example: 'Ufficio Didattica' },
        telefonoInterno: { type: 'string', example: '0321' },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSegreteriaDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}