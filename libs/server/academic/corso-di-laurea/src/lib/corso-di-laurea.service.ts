// libs/academic/corso-di-laurea/src/lib/corso-di-laurea.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CorsoDiLaureaRepository } from './corso-di-laurea.repository';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';

@Injectable()
export class CorsoDiLaureaService {
  constructor(private readonly repository: CorsoDiLaureaRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    const corso = await this.repository.findById(id);
    if (!corso) throw new NotFoundException('Corso di laurea non trovato');
    return corso;
  }

  async create(data: Partial<CorsoDiLaureaEntity>) {
    if (data.codice) {
      const existing = await this.repository.findByCodice(data.codice);
      if (existing) throw new ConflictException('Codice corso già esistente');
    }
    return this.repository.create(data);
  }

  async remove(id: number) {
    const corso = await this.getOne(id);
    return this.repository.delete(corso.id);
  }
}