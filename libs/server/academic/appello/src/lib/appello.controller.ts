import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppelloService } from './appello.service';

@Controller('appelli')
export class AppelloController {
  constructor(private readonly service: AppelloService) {}

  @Get()
  findAll() {
    return this.service.create({}); // Nota: correggere con getAll se implementato
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