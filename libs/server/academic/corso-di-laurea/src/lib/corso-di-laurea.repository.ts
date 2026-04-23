// libs/academic/corso-di-laurea/src/lib/repositories/corso-di-laurea.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';

@Injectable()
export class CorsoDiLaureaRepository {
  constructor(
    @InjectRepository(CorsoDiLaureaEntity)
    private readonly repo: Repository<CorsoDiLaureaEntity>
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOneBy({ id });
  }

  findByCodice(codice: string) {
    return this.repo.findOneBy({ codice });
  }

  create(data: Partial<CorsoDiLaureaEntity>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: Partial<CorsoDiLaureaEntity>) {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}