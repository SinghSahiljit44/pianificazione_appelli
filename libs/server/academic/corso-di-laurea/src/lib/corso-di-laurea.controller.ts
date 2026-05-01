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

}