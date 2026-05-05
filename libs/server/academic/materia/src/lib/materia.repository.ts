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
    return this.repo.find({ relations: ['docente', 'corsi', 'corsi.corso'] });
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
    const { corsi, ...rest } = data;
    const saved = await this.repo.save(this.repo.create(rest));

    if (corsi && corsi.length > 0) {
      await this.materiaCorsoRepo.save(
        corsi.map(c => this.materiaCorsoRepo.create({
          materia: { id: saved.id },
          corso: { id: c.corsoId },
          anno: c.anno,
        }))
      );
    }

    return this.findById(saved.id) as Promise<MateriaEntity>;
  }

  async update(id: number, data: UpdateMateriaDto): Promise<MateriaEntity | null> {
    const { corsi, ...rest } = data;

    if (Object.keys(rest).length > 0) {
      await this.repo.update(id, rest);
    }

    if (corsi !== undefined) {
      await this.materiaCorsoRepo.delete({ materia: { id } });
      if (corsi.length > 0) {
        await this.materiaCorsoRepo.save(
          corsi.map(c => this.materiaCorsoRepo.create({
            materia: { id },
            corso: { id: c.corsoId },
            anno: c.anno,
          }))
        );
      }
    }

    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }

  async addCorso(materiaId: number, corsoId: number, anno: number): Promise<MateriaCorsoEntity> {
    return this.materiaCorsoRepo.save(
      this.materiaCorsoRepo.create({ materia: { id: materiaId }, corso: { id: corsoId }, anno })
    );
  }

  async removeCorso(materiaId: number, corsoId: number): Promise<void> {
    await this.materiaCorsoRepo.delete({ materia: { id: materiaId }, corso: { id: corsoId } });
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

  //Aggiunto così non incappiamo in errore di 500 se si cerca di inserire due volte la stessa cosa 
  findMateriaCorsoSpecific(materiaId: number, corsoId: number, anno: number): Promise<MateriaCorsoEntity | null> {
    return this.materiaCorsoRepo.findOne({
      where: {
        materia: { id: materiaId },
        corso: { id: corsoId },
        anno: anno
      }
    });
  }
}