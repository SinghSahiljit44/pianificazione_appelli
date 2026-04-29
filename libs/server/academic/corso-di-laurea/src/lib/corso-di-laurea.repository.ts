// libs/academic/corso-di-laurea/src/lib/repositories/corso-di-laurea.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';
import { CreateCorsoDiLaureaDto } from './dto/createcorsodilaurea.dto';
import { UpdateCorsoDiLaureaDto } from './dto/updatecorsodilaurea.dto';

@Injectable()
export class CorsoDiLaureaRepository {
  constructor(
    @InjectRepository(CorsoDiLaureaEntity)
    private readonly repo: Repository<CorsoDiLaureaEntity>
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['materie']
    });
  }

  findByCodice(codice: string) {
    return this.repo.findOne({ where: { codice }, relations: ['materie'] });
  }

  create(data: CreateCorsoDiLaureaDto) {
    return this.repo.save(this.repo.create(data));
  }

  async update(codice: string, data: UpdateCorsoDiLaureaDto) {
    await this.repo.update({ codice }, data);
    return this.findByCodice(codice);
  }

  delete(codice: string) {
    return this.repo.delete({ codice });
  }
}