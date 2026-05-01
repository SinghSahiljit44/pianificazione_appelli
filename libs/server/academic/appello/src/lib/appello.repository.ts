import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
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
      relations: ['materia', 'materia.corsi', 'docente', 'sessione'],
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
      relations: ['materia', 'materia.corsi', 'docente'],
      order: { data: 'ASC' }
    });
  }
  //createQueryBuilder per query più complesse, da vedere
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
 
  async countByMateriaAndSessione(materiaId: number, sessioneId: number): Promise<number> {
    return this.repository.count({
      where: {
        materia: { id: materiaId },
        sessione: { id: sessioneId }
      }
    });
  }
}