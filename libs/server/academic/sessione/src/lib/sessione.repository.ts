import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SessioneEntity } from './sessione.entity';

type CreateSessioneData = {
  nome: string;
  dataInizio: Date;
  dataFine: Date;
  dataInizioInserimento: Date;
  dataFineInserimento: Date;
};

type UpdateSessioneData = Partial<CreateSessioneData>;

@Injectable()
export class SessioneRepository {
  constructor(
    @InjectRepository(SessioneEntity)
    private readonly repo: Repository<SessioneEntity>
  ) {}

  findAll() {
    return this.repo.find({ 
      order: { dataInizio: 'DESC' } 
    });
  }

  findById(id: number): Promise<SessioneEntity|null> {
    return this.repo.findOne({ where: { id } });
  }

  findAttiva() {
    const now = new Date();
    return this.repo.findOne({
      where: {
        dataInizioInserimento: LessThanOrEqual(now),
        dataFineInserimento: MoreThanOrEqual(now)
      }
    });
  }

  findAttive() {
    const now = new Date();
    return this.repo.find({
      where: {
        dataInizioInserimento: LessThanOrEqual(now),
        dataFineInserimento: MoreThanOrEqual(now)
      },
      order: { dataInizio: 'ASC' }
    });
  }

  async findWithAppelli() {
    const sessioni = await this.repo.find({
      relations: ['appelli', 'appelli.materia', 'appelli.docente'],
      order: { dataInizio: 'DESC' },
    });
    return sessioni.filter(s => s.appelli.length > 0);
  }

  findByDateRange(start: Date, end: Date) {
    return this.repo.find({
      where: {
        dataInizio: Between(start, end)
      },
      order: { dataInizio: 'DESC' }
    });
  }

  create(data: CreateSessioneData) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: UpdateSessioneData) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  async existsOverlap(dataInizio: Date, dataFine: Date, excludeId?: number): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        dataInizio: LessThanOrEqual(dataFine),
        dataFine: MoreThanOrEqual(dataInizio),
        ...(excludeId && { id: Not(excludeId) })
      }
    });

    return count > 0;
  }
}