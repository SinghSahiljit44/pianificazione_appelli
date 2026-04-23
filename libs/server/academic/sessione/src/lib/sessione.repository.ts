// libs/academic/sessione/src/lib/repositories/sessione.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessioneEntity } from './sessione.entity';

@Injectable()
export class SessioneRepository {
  constructor(
    @InjectRepository(SessioneEntity)
    private readonly repo: Repository<SessioneEntity>
  ) {}

  findAll() {
    return this.repo.find({ order: { dataInizio: 'DESC' } });
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  findAttiva() {
    return this.repo.findOneBy({ attiva: true });
  }

  create(data: Partial<SessioneEntity>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<SessioneEntity>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}