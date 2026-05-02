import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@server/security';
import { UserRole } from '@server/users';
import type { AuthenticatedUser } from '@server/auth';
import { DocenteService } from '@server/docente';
import { AppelloService } from './appello.service';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';

@ApiTags('Appelli APIs')
@Controller('appelli')
@UseGuards(JwtAuthGuard)
export class AppelloController {
  constructor(
    private readonly service: AppelloService,
    private readonly docenteService: DocenteService,
  ) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.service.getAll();
  }

  @Get('sessione/:sessioneId')
  @ApiBearerAuth()
  findBySessione(@Param('sessioneId', ParseIntPipe) sessioneId: number) {
    return this.service.getBySessione(sessioneId);
  }

  @Get('materia/:materiaId')
  @ApiBearerAuth()
  findByMateria(@Param('materiaId', ParseIntPipe) materiaId: number) {
    return this.service.getByMateria(materiaId);
  }

  @Get('corso/:corsoId')
  @ApiBearerAuth()
  findByCorso(@Param('corsoId', ParseIntPipe) corsoId: number) {
    return this.service.getByCourse(corsoId);
  }

  @Get('docente/:docenteId')
  @ApiBearerAuth()
  findByDocente(@Param('docenteId', ParseIntPipe) docenteId: number) {
    return this.service.getByDocente(docenteId);
  }

  @Get('miei')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restituisce gli appelli del docente autenticato' })
  async getMiei(@CurrentUser() user: AuthenticatedUser) {
    const docente = await this.docenteService.getByUserId(user.id);
    return this.service.getByDocente(docente.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  //Le segreterie possono inserire appelli?
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiBody({ type: CreateAppelloDto })
  //Ho messo whitelist pk il mio lato cybersecurity ha preso il soppravvento (toglie dati che non ci sono dichiarati nel dto)
  async create(@Body(new ValidationPipe({ transform: true, whitelist: true })) data: CreateAppelloDto, @CurrentUser() user: AuthenticatedUser) {
    const docente = await this.docenteService.getByUserId(user.id);
    return this.service.create(data, docente.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateAppelloDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateAppelloDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const docente = await this.docenteService.getByUserId(user.id);
    return this.service.update(id, data, docente.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER) //Potrebbe rimuoverlo anche admin? 
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    const docente = await this.docenteService.getByUserId(user.id);
    return this.service.remove(id, docente.id);
  }
}