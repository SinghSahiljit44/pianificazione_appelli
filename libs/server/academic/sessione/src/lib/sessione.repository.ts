import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SessioneEntity } from './sessione.entity';
import { UpdateSessioneDto } from './dto/updatesessione.dto';
import { CreateSessioneDto } from './dto/createsessione.dto';

@Injectable()
export class SessioneRepository {
  constructor(
    @InjectRepository(SessioneEntity)
    private readonly repo: Repository<SessioneEntity>
  ) {}

  findAll() {
    return this.repo.find({ 
      relations: ['creataDa'],
      order: { dataInizio: 'DESC' } 
    });
  }

  findById(id: number): Promise<SessioneEntity|null> {
    return this.repo.findOne({ where: { id }, relations: ['creataDa'] });
  }

  findAttiva() {
    return this.repo.findOne({ where: { attiva: true }, relations: ['creataDa'] });
  }

  findWithAppelli() {
    return this.repo.find({
      relations: ['appelli', 'appelli.materia', 'appelli.docente'],
      order: { dataInizio: 'DESC' }
    });
  }

  findByCreataDa(segreteriaId: number) {
    return this.repo.find({
      where: { creataDa: { id: segreteriaId } },
      relations: ['creataDa'],
      order: { dataInizio: 'DESC' }
    });
  }

  findByDateRange(start: Date, end: Date) {
    return this.repo.find({
      where: {
        dataInizio: Between(start, end)
      },
      order: { dataInizio: 'DESC' }
    });
  }

  async setAttiva(id: number, attiva: boolean) {
    await this.repo.update(id, { attiva }); 
  }

  create(data: CreateSessioneDto) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: UpdateSessioneDto) {
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