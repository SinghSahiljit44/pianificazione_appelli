// libs/academic/segreteria/src/lib/repositories/segreteria.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SegreteriaEntity } from './segreteria.entity';

@Injectable()
export class SegreteriaRepository {
  constructor(
    @InjectRepository(SegreteriaEntity)
    private readonly repo: Repository<SegreteriaEntity>
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  create(data: Partial<SegreteriaEntity>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<SegreteriaEntity>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}