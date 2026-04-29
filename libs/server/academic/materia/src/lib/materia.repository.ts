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
    return this.repo.find({ relations: ['docente', 'corso'] });
  }

  async create(data: CreateMateriaDto): Promise<MateriaEntity> {
    const materia = this.repo.create(data);
    return this.repo.save(materia);
  }

  async update(codice: string, data: UpdateMateriaDto): Promise<MateriaEntity | null> {
    await this.repo.update(codice, data);
    return this.findByCodice(codice);
  }

  async delete(codice: string) {
    await this.repo.delete(codice);
  }

  findByDocenteId(docenteId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { docente: { id: docenteId } },
      relations: ['docente', 'corso']
    });
  }

  findByCorsoId(corsoId: string): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { 
        corso: { codice: corsoId } 
      },
      relations: ['docente', 'corso']
    });
  }

  findByCodice(codice: string): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { codice },
      relations: ['docente', 'corso']
    });
  } 

  findWithAppelli(codice: string): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { codice },
      relations: ['docente', 'corso', 'appelli']
    });
  }
}