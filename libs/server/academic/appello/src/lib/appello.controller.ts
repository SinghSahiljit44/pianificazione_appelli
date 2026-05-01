import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppelloService } from './appello.service';

@Controller('appelli')
export class AppelloController {
  constructor(private readonly service: AppelloService) {}


}