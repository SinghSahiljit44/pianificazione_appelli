import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MateriaEntity } from './materia.entity';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';
import { MateriaCorsoEntity } from './materia-corso.entity';

@Injectable()
export class MateriaRepository {
  constructor(
    @InjectRepository(MateriaEntity)
    private readonly repo: Repository<MateriaEntity>,
    @InjectRepository(MateriaCorsoEntity)
    private readonly materiaCorsoRepo: Repository<MateriaCorsoEntity>
  ) {}

  async findAll(): Promise<MateriaEntity[]> {
    return this.repo.find({ relations: ['docente', 'corsi'] });
  }

  findMateriaCorso(materiaId: number, corsoId: number): Promise<MateriaCorsoEntity | null> {
    return this.materiaCorsoRepo.findOne({
      where: {
        materia: { id: materiaId },
        corso: { id: corsoId }
      },
      relations: ['materia', 'corso']
    });
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
      relations: ['docente', 'corsi', 'corsi.corso']
    });
  }

  findByCorsoId(corsoId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { 
        corsi: { corso: { id: corsoId } } 
      },
      relations: ['docente', 'corsi', 'corsi.corso']
    });
  }

  findById(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'corsi', 'corsi.corso']
    });
  } 

  findWithAppelli(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'corsi', 'corsi.corso', 'appelli']
    });
  }
}