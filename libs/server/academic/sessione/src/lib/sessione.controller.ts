// libs/academic/sessione/src/lib/sessione.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SessioneService } from './sessione.service';
import { Roles } from '@server/security'; 
import { RolesGuard } from '@server/security'; 
import { JwtAuthGuard } from '@server/security'; 
import { UserRole } from '@server/users';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('sessioni') // Raggruppa gli endpoint in Swagger
@Controller('sessioni')
export class SessioneController {
  constructor(private readonly service: SessioneService) {}

  @Get()
  findAll() {
    return this.service.getAll();
  }

  @Get('attiva')
  findAttiva() {
    return this.service.getActiveSession();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea una nuova sessione (Solo Segreteria)' })
  @ApiResponse({ status: 403, description: 'Forbidden: Permessi insufficienti' })
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Delete(':id')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}