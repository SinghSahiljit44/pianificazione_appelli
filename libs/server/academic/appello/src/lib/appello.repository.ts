import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AppelloEntity } from './appello.entity';

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repo: Repository<AppelloEntity>
  ) {}

  async findByDateAndCourse(dataOra: Date, materiaId: number) {
    return this.repo.findOne({
      where: {
        dataOra, //controllare, possibili problemi in quanto timestamp
        materia: { id: materiaId }
      }
    });
  }

  //controllo unicità appello per materia e sessione?

  async findAllByDocente(docenteId: number) {
    return this.repo.find({
      where: { docente: { id: docenteId } },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllBySessione(sessioneId: number) {
    return this.repo.find({
      where: { sessione: { id: sessioneId } },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllByMateria(materiaId: number) {
    return this.repo.find({
      where: { materia: { id: materiaId } },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findById(id: number) { //for testing?
    const appello = await this.repo.findOne({
      where: { id },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione']
    });
    if (!appello) {
      throw new NotFoundException(`Appello con ID ${id} non trovato`);
    }
    return appello;
  }

  async findByDateRange(start: Date, end: Date) {
    return this.repo.find({
      where: {
        dataOra: Between(start, end)
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findByCourse(corsoId: number) {
    return this.repo.find({
      where: {
        materia: {
          corsoId
        }
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async create(data: Partial<AppelloEntity>) {
    const appello = this.repo.create(data);
    return this.repo.save(appello);
  }

  async update(id: number, appelloAggiornato: Partial<AppelloEntity>) {
    await this.repo.update(id, appelloAggiornato);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}