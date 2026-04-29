import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AppelloEntity } from './appello.entity';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';
import { CorsoDiLaureaEntity } from '../../../corso-di-laurea/src/lib/corso-di-laurea.entity';

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repository: Repository<AppelloEntity>
  ) {}
  
  async findAll(): Promise<AppelloEntity[] | null> {
    return this.repository.find({
      relations: ['materia', 'materia.corsoDiLaurea', 'docente', 'sessione'],
      order: { dataOra: 'ASC' },
    });
  }

  async findAllByDocente(docenteId: number) {
    return this.repository.find({
      where: { 
        docente: { id: docenteId } 
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllBySessione(sessioneId: number) {
    return this.repository.find({
      where: { 
        sessione: { id: sessioneId } 
      },
      relations: ['materia', 'materia.corsoDiLaurea', 'docente'],
      order: { dataOra: 'ASC' }
    });
  }

  async findAllByMateria(materiaCodice: string) {
    return this.repository.find({
      where: { 
        materia: { codice: materiaCodice } 
      },
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

  async findByCourse(corsoDiLaurea: CorsoDiLaureaEntity) { //to be checked
    return this.repository.find({
      where: {
        materia: { corso: corsoDiLaurea }
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
  /*

  Metodo generato per verificare sovrapposizioni di appelli per aula. Risulta problematico in quanto
  uno troviamo un magic number (2 ore) due non necessario forse implementarlo in quanto anche non abbiamo durata esame

  async findOverlap(aula: string, inizio: Date, fine: Date, excludeId?: number): Promise<AppelloEntity | null> {
    return this.repository.findOne({
      where: {
        aula: aula,
        dataOra: And(
          LessThan(fine), 
          MoreThan(new Date(inizio.getTime() - 2 * 60 * 60 * 1000)) // Range di 2 ore: scelto da chi?
        ),
        ...(excludeId && { id: Not(excludeId) })
      }
    });
  }
  */
 
  async countByMateriaAndSessione(materiaCodice: string, sessioneId: number): Promise<number> {
    return this.repository.count({
      where: {
        materia: { codice: materiaCodice },
        sessione: { id: sessioneId }
      }
    });
  }
}