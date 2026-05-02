import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '@server/security';
import { UserRole } from '@server/users';
import { CorsoDiLaureaService } from './corso-di-laurea.service';
import { CreateCorsoDiLaureaDto } from './dto/createcorsodilaurea.dto';
import { UpdateCorsoDiLaureaDto } from './dto/updatecorsodilaurea.dto';

@ApiTags('Corsi di Laurea APIs')
@Controller('corsi-laurea')
@UseGuards(JwtAuthGuard)
export class CorsoDiLaureaController {
  constructor(private readonly service: CorsoDiLaureaService) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Ingegneria Informatica' },
        descrizione: { type: 'string', example: 'Corso triennale in Ingegneria Informatica' },
        durataAnni: { type: 'number', example: 3 },
      },
      required: ['nome'],
    },
  })
  create(@Body() data: CreateCorsoDiLaureaDto) {
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
        nome: { type: 'string', example: 'Ingegneria Informatica' },
        descrizione: { type: 'string', example: 'Corso triennale in Ingegneria Informatica' },
        durataAnni: { type: 'number', example: 3 },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCorsoDiLaureaDto) {
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