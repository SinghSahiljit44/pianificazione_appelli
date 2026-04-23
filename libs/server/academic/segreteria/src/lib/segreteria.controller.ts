import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SegreteriaService } from './segreteria.service';

@Controller('segreteria')
export class SegreteriaController {
  constructor(private readonly service: SegreteriaService) {}

  @Get() //rivedere i get, post e delete di questa classe. Possono essere modificati?
  findAll() {
    return this.service.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}