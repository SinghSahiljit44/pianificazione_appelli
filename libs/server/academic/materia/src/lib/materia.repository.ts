import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MateriaEntity } from './materia.entity';

@Injectable()
export class MateriaRepository {
  constructor(
    @InjectRepository(MateriaEntity)
    private readonly repo: Repository<MateriaEntity>
  ) {}

  async findAll(): Promise<MateriaEntity[]> {
    return this.repo.find({ relations: ['docente', 'corso'] });
  }

  async findById(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({ 
      where: { id }, 
      relations: ['docente', 'corso'] 
    });
  }

  async create(data: Partial<MateriaEntity>): Promise<MateriaEntity> {
    const materia = this.repo.create(data);
    return this.repo.save(materia);
  }

  async update(id: number, data: Partial<MateriaEntity>): Promise<MateriaEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}