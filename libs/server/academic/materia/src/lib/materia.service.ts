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

  async getByDocenteId(docenteId: number) {
    const materie = await this.repository.findByDocenteId(docenteId);
    if (!materie || materie.length === 0) throw new NotFoundException(`Materia con docente ${docenteId} non trovata`);
    return materie;
  }

  async getByCorsoId(corsoId: number) {
    const materie = await this.repository.findByCorsoId(corsoId);
    if (!materie || materie.length === 0) throw new NotFoundException(`Nessuna materia trovata per il corso ${corsoId}`);
    return materie;
  }

  async getWithAppelli(id: number) {
    const materia = await this.repository.findWithAppelli(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return materia;
  }

  async getCorsiIDsByMateria(materiaId: number): Promise<number[]>{
    const materia = await this.repository.findById(materiaId);
    if (!materia) throw new NotFoundException(`Materia ${materiaId} non trovata`);
    return materia.corsi.map(c => c.corso.id);
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
    //cosa deve controllare?
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateMateriaDto) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return this.repository.delete(id);
  }

  async addMateriaToCorso(materiaId: number, corsoId: number, anno: number) {
    await this.getOne(materiaId);
    return this.repository.addCorso(materiaId, corsoId, anno);
  }

  async removeMateriaFromCorso(materiaId: number, corsoId: number) {
    await this.getOne(materiaId);
    return this.repository.removeCorso(materiaId, corsoId);
  }
}