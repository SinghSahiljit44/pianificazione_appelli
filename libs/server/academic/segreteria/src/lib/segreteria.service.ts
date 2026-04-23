// libs/academic/segreteria/src/lib/segreteria.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { SegreteriaRepository } from './segreteria.repository';

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

  async create(data: any) {
    // In un caso reale, qui potresti forzare il ruolo dell'User a 'ADMIN' o 'STAFF'
    return this.repository.create(data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}