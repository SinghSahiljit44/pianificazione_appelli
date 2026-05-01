// libs/academic/segreteria/src/lib/segreteria.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { SegreteriaRepository } from './segreteria.repository';
import { CreateSegreteriaDto } from './dto/createsegreteria.dto';
import { UpdateSegreteriaDto } from './dto/updatesegreteria.dto';

@Injectable()
export class SegreteriaService {
  constructor(private readonly repository: SegreteriaRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    const profilo = await this.repository.findById(id);
    if (!profilo) throw new NotFoundException("Profilo segreteria non trovato");
    return profilo;
  }

  async create(data: CreateSegreteriaDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateSegreteriaDto) {
    await this.getOne(id);
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    await this.getOne(id);
    return this.repository.delete(id);
  }
}