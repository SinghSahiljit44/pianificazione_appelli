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


}