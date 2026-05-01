// libs/academic/materia/src/lib/materia.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MateriaRepository } from './materia.repository';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';

@Injectable()
export class MateriaService {
  constructor(private readonly repository: MateriaRepository) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getCorsiIDsByMateria(materiaId: number): Promise<number[]>{
    const materia = await this.repository.findById(materiaId);
    if (!materia) throw new NotFoundException(`Materia ${materiaId} non trovata`);
    const corsiIds: number[] = [];
    for (const corso of materia.corsi) {
      corsiIds.push(corso.corso.id);
    }
    return corsiIds;
  }

  async getMateriaCorso(materiaId: number, corsoId: number) {
    return this.repository.findMateriaCorso(materiaId, corsoId);
  }

  async getOne(id: number) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return materia;
  }

  async create(data: CreateMateriaDto) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateMateriaDto) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}