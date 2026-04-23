// libs/academic/materia/src/lib/materia.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MateriaRepository } from './materia.repository';
import { MateriaEntity } from './materia.entity';

@Injectable()
export class MateriaService {
  constructor(private readonly repository: MateriaRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return materia;
  }

  async create(data: Partial<MateriaEntity>) {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<MateriaEntity>) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}