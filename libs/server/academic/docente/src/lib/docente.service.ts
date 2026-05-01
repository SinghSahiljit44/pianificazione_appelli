// libs/academic/docente/src/lib/docente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DocenteRepository } from './docente.repository';
import { DocenteEntity } from './docente.entity';
import { CreateDocenteDto } from './dto/createdocente.dto';
import { UpdateDocenteDto } from './dto/updatedocente.dto';

@Injectable()
export class DocenteService {
  constructor(private readonly repository: DocenteRepository) {}


  async getAppelliIdsByDocenteId(docenteId: number): Promise<number[]> {
    const docente = await this.repository.findById(docenteId);
    if (!docente) throw new NotFoundException(`Docente ${docenteId} non trovato`);
    const appelliIds: number[] = [];
    for (const appello of docente.appelli) {
      appelliIds.push(appello.id);
    }
    return appelliIds;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException('Docente non trovato');
    return docente;
  }

  async create(data: CreateDocenteDto) {
    // Qui potresti iniettare UserService per validare l'esistenza dello userId
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateDocenteDto) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}