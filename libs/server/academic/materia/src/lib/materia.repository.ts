import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MateriaEntity } from './materia.entity';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';

@Injectable()
export class MateriaRepository {
  constructor(
    @InjectRepository(MateriaEntity)
    private readonly repo: Repository<MateriaEntity>
  ) {}

  async findAll(): Promise<MateriaEntity[]> {
    return this.repo.find({ relations: ['docente', 'corsi'] });
  }

  async create(data: CreateMateriaDto): Promise<MateriaEntity> {
    const materia = this.repo.create(data);
    return this.repo.save(materia);
  }

  async update(id: number, data: UpdateMateriaDto): Promise<MateriaEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }

  findByDocenteId(docenteId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { docente: { id: docenteId } },
      relations: ['docente', 'corsi']
    });
  }

  findByCorsoId(corsoId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { 
        corsi: { corso: { id: corsoId } } 
      },
      relations: ['docente', 'corsi']
    });
  }

  findById(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'corsi']
    });
  } 

  findWithAppelli(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'corsi', 'appelli']
    });
  }
}