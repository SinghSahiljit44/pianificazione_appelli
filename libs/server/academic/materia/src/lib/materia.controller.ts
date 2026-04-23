// libs/academic/materia/src/lib/materia.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaEntity } from './materia.entity';

@Controller('materie')
export class MateriaController {
  constructor(private readonly service: MateriaService) {}

  @Get()
  findAll() {
    return this.service.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Post()
  create(@Body() data: Partial<MateriaEntity>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<MateriaEntity>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}