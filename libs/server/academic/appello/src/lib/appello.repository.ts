import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, FindOptionsRelations } from 'typeorm';
import { AppelloEntity } from '@server/academic-entities';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';

const APPELLO_RELATIONS: FindOptionsRelations<AppelloEntity> = {
  materia: { corsi: { corso: true } },
  docente: { user: true },
  sessione: true,
};

@Injectable()
export class AppelloRepository {
  constructor(
    @InjectRepository(AppelloEntity)
    private readonly repository: Repository<AppelloEntity>,
  ) {}

  async findAll(): Promise<AppelloEntity[]> {
    return this.repository.find({
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }

  async findAllByDocente(docenteId: number) {
    return this.repository.find({
      where: {
        docente: { id: docenteId },
      },
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }

  async findAllBySessione(sessioneId: number) {
    return this.repository.find({
      where: {
        sessione: { id: sessioneId },
      },
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }
  async findDuplicate(
    data: Date,
    corsoId: number,
    anno: number,
    excludeId?: number,
  ) {
    return this.repository.findOne({
      where: {
        data, //need to check only for the day!!!!
        materia: { corsi: { corso: { id: corsoId }, anno } },
        ...(excludeId && { id: Not(excludeId) }),
      },
    });
  }

  async findAllByMateria(materiaId: number) {
    return this.repository.find({
      where: {
        materia: { id: materiaId },
      },
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }

  async findByDateRange(start: Date, end: Date) {
    return this.repository.find({
      where: {
        data: Between(start, end),
      },
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }

  async findByCourseId(corsoId: number) {
    return this.repository.find({
      where: {
        materia: { corsi: { corso: { id: corsoId } } },
      },
      relations: APPELLO_RELATIONS,
      order: { data: 'ASC' },
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: APPELLO_RELATIONS,
    });
  }

  async create(data: CreateAppelloDto, docenteId: number) {
    const appello = this.repository.create({
      data: data.data,
      ora: data.ora,
      aula: data.aula,
      note: data.note,
      materia: { id: data.materiaId } as any,
      sessione: { id: data.sessioneId } as any,
      docente: { id: docenteId } as any,
    });
    const saved = await this.repository.save(appello);
    return this.findById(saved.id);
  }

  async update(id: number, data: UpdateAppelloDto) {
    const payload: any = {};
    if (data.data !== undefined) payload.data = data.data;
    if (data.ora !== undefined) payload.ora = data.ora;
    if (data.aula !== undefined) payload.aula = data.aula;
    if (data.note !== undefined) payload.note = data.note;
    if (data.materiaId !== undefined) payload.materia = { id: data.materiaId };
    if (data.sessioneId !== undefined)
      payload.sessione = { id: data.sessioneId };
    if (Object.keys(payload).length > 0)
      await this.repository.update(id, payload);
    return this.findById(id);
  }

  async delete(id: number) {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async countByMateriaAndSessione(
    materiaId: number,
    sessioneId: number,
    excludeId?: number,
  ): Promise<number> {
    return this.repository.count({
      where: {
        materia: { id: materiaId },
        sessione: { id: sessioneId },
        ...(excludeId && { id: Not(excludeId) }),
      },
    });
  }
}
