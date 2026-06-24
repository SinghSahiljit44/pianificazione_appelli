import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { MateriaEntity } from '@server/academic-entities';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';
import { AppelloEntity, MateriaCorsoEntity } from '@server/academic-entities';

@Injectable()
export class MateriaRepository {
  constructor(
    @InjectRepository(MateriaEntity)
    private readonly repo: Repository<MateriaEntity>,
    @InjectRepository(MateriaCorsoEntity)
    private readonly materiaCorsoRepo: Repository<MateriaCorsoEntity>,
    @InjectRepository(AppelloEntity)
    private readonly appelloRepo: Repository<AppelloEntity>,
  ) {}

  async findAll(): Promise<MateriaEntity[]> {
    return this.repo.find({
      relations: ['docente', 'docente.user', 'corsi', 'corsi.corso'],
    });
  }

  findMateriaCorso(
    materiaId: number,
    corsoId: number,
  ): Promise<MateriaCorsoEntity | null> {
    return this.materiaCorsoRepo.findOne({
      where: {
        materia: { id: materiaId },
        corso: { id: corsoId },
      },
      relations: ['materia', 'corso'],
    });
  }

  async create(data: CreateMateriaDto): Promise<MateriaEntity> {
    const { corsi, docenteId, ...scalars } = data;
    const entity = this.repo.create(scalars);
    if (docenteId !== undefined) (entity as any).docente = { id: docenteId };
    const saved = await this.repo.save(entity);

    if (corsi && corsi.length > 0) {
      await this.materiaCorsoRepo.save(
        corsi.map((c) =>
          this.materiaCorsoRepo.create({
            materia: { id: saved.id },
            corso: { id: c.corsoId },
            anno: c.anno,
          }),
        ),
      );
    }

    return this.findById(saved.id) as Promise<MateriaEntity>;
  }

  async update(
    id: number,
    data: UpdateMateriaDto,
  ): Promise<MateriaEntity | null> {
    const { corsi, docenteId, ...scalars } = data;
    const defined = Object.fromEntries(
      Object.entries(scalars).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(defined).length > 0) {
      await this.repo.update(id, defined);
    }
    if (docenteId !== undefined) {
      await this.repo.save({ id, docente: { id: docenteId } } as any);
    }

    if (corsi !== undefined) {
      await this.materiaCorsoRepo.delete({ materia: { id } });
      if (corsi.length > 0) {
        await this.materiaCorsoRepo.save(
          corsi.map((c) =>
            this.materiaCorsoRepo.create({
              materia: { id },
              corso: { id: c.corsoId },
              anno: c.anno,
            }),
          ),
        );
      }
    }

    return this.findById(id);
  }

  async delete(id: number) {
    await this.repo.delete(id);
  }

  async addCorso(
    materiaId: number,
    corsoId: number,
    anno: number,
  ): Promise<MateriaCorsoEntity> {
    return this.materiaCorsoRepo.save(
      this.materiaCorsoRepo.create({
        materia: { id: materiaId },
        corso: { id: corsoId },
        anno,
      }),
    );
  }

  async removeCorso(materiaId: number, corsoId: number): Promise<void> {
    await this.materiaCorsoRepo.delete({
      materia: { id: materiaId },
      corso: { id: corsoId },
    });
  }

  findByDocenteId(docenteId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: { docente: { id: docenteId } },
      relations: ['docente', 'docente.user', 'corsi', 'corsi.corso'],
    });
  }

  findByCorsoId(corsoId: number): Promise<MateriaEntity[]> {
    return this.repo.find({
      where: {
        corsi: { corso: { id: corsoId } },
      },
      relations: ['docente', 'docente.user', 'corsi', 'corsi.corso'],
    });
  }

  findById(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'docente.user', 'corsi', 'corsi.corso'],
    });
  }

  findWithAppelli(id: number): Promise<MateriaEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['docente', 'docente.user', 'corsi', 'corsi.corso', 'appelli'],
    });
  }

  findMateriaCorsoSpecific(
    materiaId: number,
    corsoId: number,
    anno: number,
  ): Promise<MateriaCorsoEntity | null> {
    return this.materiaCorsoRepo.findOne({
      where: {
        materia: { id: materiaId },
        corso: { id: corsoId },
        anno: anno,
      },
    });
  }

  /**
   * Appelli che entrerebbero in conflitto se la materia venisse associata a
   * (corsoId, anno): appelli di ALTRE materie già in quella combinazione, nelle
   * stesse date in cui questa materia ha un appello (→ due appelli lo stesso
   * giorno per lo stesso corso e anno).
   */
  async findAppelliInConflittoPerAssociazione(
    materiaId: number,
    corsoId: number,
    anno: number,
  ): Promise<AppelloEntity[]> {
    const appelliMateria = await this.appelloRepo.find({
      where: { materia: { id: materiaId } },
    });
    if (appelliMateria.length === 0) return [];

    const date = appelliMateria.map((a) => a.data);

    return this.appelloRepo.find({
      where: {
        data: In(date),
        materia: { id: Not(materiaId), corsi: { corso: { id: corsoId }, anno } },
      },
      relations: { materia: true },
    });
  }
}
