// libs/academic/docente/src/lib/docente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DocenteRepository } from './docente.repository';
import { DocenteEntity } from './docente.entity';

@Injectable()
export class DocenteService {
  constructor(private readonly repository: DocenteRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException('Docente non trovato');
    return docente;
  }

  async create(data: Partial<DocenteEntity>) {
    // Qui potresti iniettare UserService per validare l'esistenza dello userId
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<DocenteEntity>) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}