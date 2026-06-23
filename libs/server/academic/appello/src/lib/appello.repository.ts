import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { AppelloEntity } from './appello.entity';

type CreateAppelloData = {
  data: Date;
  ora: string;
  aula: string;
  note?: string;
  materiaId: number;
  sessioneId: number;
  docenteId: number;
};

type UpdateAppelloData = {
  data?: Date;
  ora?: string;
  aula?: string;
  note?: string;
  materiaId?: number;
  sessioneId?: number;
};

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repository: Repository<AppelloEntity>
  ) {}
  
  async findAll(): Promise<AppelloEntity[]> {
    return this.repository.find({
      relations: ['materia', 'materia.corsi', 'docente', 'docente.user', 'sessione'],
      order: { data: 'ASC' },
    });
  }

  async findAllByDocente(docenteId: number) {
    return this.repository.find({
      where: { 
        docente: { id: docenteId } 
      },
      relations: ['materia', 'materia.corsi', 'sessione'],
      order: { data: 'ASC' }
    });
  }

  async findAllBySessione(sessioneId: number) {
    return this.repository.find({
      where: {
        sessione: { id: sessioneId }
      },
      relations: ['materia', 'materia.corsi', 'materia.corsi.corso', 'docente', 'docente.user'],
      order: { data: 'ASC' }
    });
  }
  async findDuplicate(data: Date, corsoId: number, anno: number, excludeId?: number) {
    return this.repository.findOne({
      where: {
        data, //need to check only for the day!!!!
        materia: { corsi: { corso: { id: corsoId }, anno } },
        ...(excludeId && { id: Not(excludeId) })
      },
    });
  }

  async findAllByMateria(materiaId: number) {
    return this.repository.find({
      where: { 
        materia: { id: materiaId } 
      },
      relations: ['materia', 'materia.corsi', 'docente', 'sessione'],
      order: { data: 'ASC' }
    });
  }

  async findByDateRange(start: Date, end: Date) {
    return this.repository.find({
      where: {
        data: Between(start, end)
      },
      relations: ['materia', 'materia.corsi', 'docente', 'sessione'],
      order: { data: 'ASC' }
    });
  }

  async findByCourseId(corsoId: number) {
    return this.repository.find({
      where: {
        materia: { corsi: { corso: { id: corsoId } } }
      },
      relations: ['materia', 'materia.corsi', 'docente', 'sessione'],
      order: { data: 'ASC' }
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['materia', 'materia.corsi', 'docente', 'sessione']
    });
  }

  async create(data: CreateAppelloData) {
    const appello = this.repository.create({
      data: data.data,
      ora: data.ora,
      aula: data.aula,
      note: data.note,
      materia: { id: data.materiaId } as any,
      sessione: { id: data.sessioneId } as any,
      docente: { id: data.docenteId } as any,
    });
    const saved = await this.repository.save(appello);
    return this.findById(saved.id);
  }

  async update(id: number, data: UpdateAppelloData) {
    const payload: any = {};
    if (data.data !== undefined) payload.data = data.data;
    if (data.ora !== undefined) payload.ora = data.ora;
    if (data.aula !== undefined) payload.aula = data.aula;
    if (data.note !== undefined) payload.note = data.note;
    if (data.materiaId !== undefined) payload.materia = { id: data.materiaId };
    if (data.sessioneId !== undefined) payload.sessione = { id: data.sessioneId };
    if (Object.keys(payload).length > 0) await this.repository.update(id, payload);
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
 
  async countByMateriaAndSessione(materiaId: number, sessioneId: number, excludeId?: number): Promise<number> {
    return this.repository.count({
      where: {
        materia: { id: materiaId },
        sessione: { id: sessioneId },
        ...(excludeId && { id: Not(excludeId) })
      }
    });
  }
}