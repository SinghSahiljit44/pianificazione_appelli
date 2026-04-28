import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan, Not, And } from 'typeorm';
import { AppelloEntity } from './appello.entity';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repository: Repository<AppelloEntity>
  ) {}
  
  async findAll(): Promise<AppelloEntity[]> {
    return this.repository.find({
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' },
    });
  }

  async findAllByDocente(docenteId: number) {
    return this.repository.find({
      where: { docenteId },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllBySessione(sessioneId: number) {
    return this.repository.find({
      where: { sessioneId },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllByMateria(materiaId: number) {
    return this.repository.find({
      where: { materiaId },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findByDateRange(start: Date, end: Date) {
    return this.repository.find({
      where: {
        dataOra: Between(start, end)
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findByCourse(corsoId: number) {
    return this.repository.find({
      where: {
        materia: { corsoId }
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione']
    });
  }

  async create(data: CreateAppelloDto & { docenteId: number }) {
    const appello = this.repository.create(data);
    return this.repository.save(appello);
  }

  async update(id: number, appelloAggiornato: UpdateAppelloDto) {
      await this.repository.update(id, appelloAggiornato);
      return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findOverlap(aula: string, inizio: Date, fine: Date, excludeId?: number): Promise<AppelloEntity | null> {
    return this.repository.findOne({
      where: {
        aula: aula,
        dataOra: And(
          LessThan(fine), 
          MoreThan(new Date(inizio.getTime() - 2 * 60 * 60 * 1000)) // Range di 2 ore
        ),
        ...(excludeId && { id: Not(excludeId) })
      }
    });
  }
  
  //per implementare un limite massimo di appelli che un untente può inserire 
  async countByMateriaAndSessione(materiaId: number, sessioneId: number): Promise<number> {
    return this.repository.count({
      where: {
        materiaId: materiaId,
        sessioneId: sessioneId
      }
    });
  }
}