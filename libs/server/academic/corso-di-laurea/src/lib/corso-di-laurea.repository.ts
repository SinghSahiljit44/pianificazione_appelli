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

  findByNome(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['materie'] });
  }

  create(data: CreateCorsoDiLaureaDto) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: UpdateCorsoDiLaureaDto) {
    await this.repo.update({ id }, data);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete({ id });
  }
}