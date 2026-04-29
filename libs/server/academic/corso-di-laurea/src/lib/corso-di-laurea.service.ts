// libs/academic/corso-di-laurea/src/lib/corso-di-laurea.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CorsoDiLaureaRepository } from './corso-di-laurea.repository';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';

@Injectable()
export class CorsoDiLaureaService {
  constructor(private readonly repository: CorsoDiLaureaRepository) {}

}