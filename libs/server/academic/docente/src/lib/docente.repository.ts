// libs/academic/docente/src/lib/repositories/docente.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocenteEntity } from './docente.entity';

@Injectable()
export class DocenteRepository {
  constructor(
    @InjectRepository(DocenteEntity)
    private readonly repo: Repository<DocenteEntity>
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['user'] });
  }

  create(data: Partial<DocenteEntity>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<DocenteEntity>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}