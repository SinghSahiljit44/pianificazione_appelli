// libs/academic/sessione/src/lib/sessione.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity } from './sessione.entity';

@Injectable()
export class SessioneService {
  constructor(private readonly repository: SessioneRepository) {}

}