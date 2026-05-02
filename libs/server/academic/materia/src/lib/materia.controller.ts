import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '@server/security';
import { UserRole } from '@server/users';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';

@ApiTags('Materie APIs')
@Controller('materie')
@UseGuards(JwtAuthGuard)
export class MateriaController {
  constructor(private readonly service: MateriaService) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.service.getAll();
  }

  @Get('docente/:docenteId')
  @ApiBearerAuth()
  findByDocente(@Param('docenteId', ParseIntPipe) docenteId: number) {
    return this.service.getByDocenteId(docenteId);
  }

  @Get('corso/:corsoId')
  @ApiBearerAuth()
  findByCorso(@Param('corsoId', ParseIntPipe) corsoId: number) {
    return this.service.getByCorsoId(corsoId);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Get(':id/con-appelli')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restituisce la materia con i relativi appelli' })
  findConAppelli(@Param('id', ParseIntPipe) id: number) {
    return this.service.getWithAppelli(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Analisi Matematica' },
        cfu: { type: 'number', example: 9 },
        docenteId: { type: 'number', example: 1 },
        corsi: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              corsoId: { type: 'number', example: 1 },
              anno: { type: 'number', example: 1 },
            },
            required: ['corsoId', 'anno'],
          },
        },
      },
      required: ['nome', 'cfu', 'corsi'],
    },
  })
  create(@Body() data: CreateMateriaDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Analisi Matematica' },
        cfu: { type: 'number', example: 9 },
        docenteId: { type: 'number', example: 1 },
        corsi: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              corsoId: { type: 'number', example: 1 },
              anno: { type: 'number', example: 1 },
            },
            required: ['corsoId', 'anno'],
          },
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMateriaDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/corsi')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Associa la materia a un corso di laurea' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        corsoId: { type: 'number', example: 1 },
        anno: { type: 'number', example: 2 },
      },
      required: ['corsoId', 'anno'],
    },
  })
  addCorso(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { corsoId: number; anno: number },
  ) {
    return this.service.addMateriaToCorso(id, body.corsoId, body.anno);
  }

  @Delete(':id/corsi/:corsoId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rimuove l\'associazione tra materia e corso di laurea' })
  removeCorso(
    @Param('id', ParseIntPipe) id: number,
    @Param('corsoId', ParseIntPipe) corsoId: number,
  ) {
    return this.service.removeMateriaFromCorso(id, corsoId);
  }
}