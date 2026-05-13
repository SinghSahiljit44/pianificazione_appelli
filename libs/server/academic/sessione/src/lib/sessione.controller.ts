import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common';
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

  @Get('attiva-per-inserimento')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restituisce la sessione attualmente attiva' })
  findAttiva() {
    return this.service.getAttiva();
  }

  @Get(':id/aperta-iniziata')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verifica se il periodo di inserimento è aperto' })
  isAperta(@Param('id', ParseIntPipe) id: number) {
    return this.service.isSessioneOpen(id);
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

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({ type: CreateSessioneDto })
  create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateSessioneDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateSessioneDto })
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateSessioneDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}