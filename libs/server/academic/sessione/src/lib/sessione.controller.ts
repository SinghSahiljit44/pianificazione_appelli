import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '@server/security';
import { UserRole } from '@server/users';
import { SessioneService } from './sessione.service';
import { CreateSessioneDto } from './dto/createsessione.dto';
import { UpdateSessioneDto } from './dto/updatesessione.dto';

@ApiTags('Sessioni APIs')
@Controller('sessioni')
@UseGuards(JwtAuthGuard)
export class SessioneController {
  constructor(private readonly service: SessioneService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista tutte le sessioni' })
  findAll() {
    return this.service.getAll();
  }

  @Get('attiva')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restituisce la sessione attualmente attiva' })
  findAttiva() {
    return this.service.getAttiva();
  }

  @Get('con-appelli')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista sessioni con i relativi appelli' })
  findConAppelli() {
    return this.service.getWithAppelli();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Get(':id/aperta')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verifica se il periodo di inserimento è aperto' })
  isAperta(@Param('id', ParseIntPipe) id: number) {
    return this.service.isSessioneOpen(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Sessione Estiva 2025' },
        dataInizio: { type: 'string', format: 'date', example: '2025-06-01' },
        dataFine: { type: 'string', format: 'date', example: '2025-07-31' },
        dataInizioInserimento: { type: 'string', format: 'date-time', example: '2025-05-01T09:00:00' },
        dataFineInserimento: { type: 'string', format: 'date-time', example: '2025-05-31T23:59:59' },
      },
      required: ['nome', 'dataInizio', 'dataFine', 'dataInizioInserimento', 'dataFineInserimento'],
    },
  })
  create(@Body() data: CreateSessioneDto) {
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
        nome: { type: 'string', example: 'Sessione Estiva 2025' },
        dataInizio: { type: 'string', format: 'date', example: '2025-06-01' },
        dataFine: { type: 'string', format: 'date', example: '2025-07-31' },
        dataInizioInserimento: { type: 'string', format: 'date-time', example: '2025-05-01T09:00:00' },
        dataFineInserimento: { type: 'string', format: 'date-time', example: '2025-05-31T23:59:59' },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSessioneDto) {
    return this.service.update(id, data);
  }

  @Patch(':id/attiva')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Imposta questa sessione come attiva (disattiva le altre)' })
  setAttiva(@Param('id', ParseIntPipe) id: number) {
    return this.service.setAttiva(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}