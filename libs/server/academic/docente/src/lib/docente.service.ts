import { Injectable, NotFoundException } from '@nestjs/common';
import { DocenteRepository } from './docente.repository';
import { CreateDocenteDto } from './dto/createdocente.dto';
import { UpdateDocenteDto } from './dto/updatedocente.dto';

@Injectable()
export class DocenteService {
  constructor(private readonly repository: DocenteRepository) {}

  async getAppelliIdsByDocenteId(docenteId: number): Promise<number[]> {
    const docente = await this.repository.findById(docenteId);
    if (!docente) throw new NotFoundException(`Docente ${docenteId} non trovato`);
    return docente.appelli.map(a => a.id);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getByUserId(userId: number) {
    const docente = await this.repository.findByUserId(userId);
    if (!docente) throw new NotFoundException(`Profilo docente non trovato per l'utente ${userId}`);
    return docente;
  }

  async getOne(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException('Docente non trovato');
    return docente;
  }

  async create(data: CreateDocenteDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateDocenteDto) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException(`Docente ${id} non trovato`);
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    const docente = await this.repository.findById(id);
    if (!docente) throw new NotFoundException(`Docente ${id} non trovato`);
    return this.repository.delete(id);
  }
}