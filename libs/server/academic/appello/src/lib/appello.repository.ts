import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppelloEntity } from './appello.entity';

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repo: Repository<AppelloEntity>
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ['materia', 'docente', 'sessione'],
      order: { dataOra: 'ASC' }
    });
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['materia', 'docente', 'sessione']
    });
  }

  async create(data: Partial<AppelloEntity>) {
    const appello = this.repo.create(data);
    return this.repo.save(appello);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}