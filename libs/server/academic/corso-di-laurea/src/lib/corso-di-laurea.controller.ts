// libs/academic/corso-di-laurea/src/lib/corso-di-laurea.controller.ts
import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CorsoDiLaureaService } from './corso-di-laurea.service';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';
import { Roles } from '@server/security'; 
import { RolesGuard } from '@server/security'; 
import { JwtAuthGuard } from '@server/security'; 
import { UserRole } from '@server/users';

@Controller('corsi-laurea')
export class CorsoDiLaureaController {
  constructor(private readonly service: CorsoDiLaureaService) {}

  @Get()
  findAll() {
    return this.service.getAll();
  }

  @Post()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  create(@Body() data: Partial<CorsoDiLaureaEntity>) {
    return this.service.create(data);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Delete(':id') 
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}