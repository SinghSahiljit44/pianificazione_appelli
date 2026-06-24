import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocenteEntity } from '@server/academic-entities';
import { UpdateDocenteDto } from './dto/updatedocente.dto';

@Injectable()
export class DocenteRepository {
  constructor(
    @InjectRepository(DocenteEntity)
    private readonly repo: Repository<DocenteEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user', 'materie'] });
  }

  findById(id: number): Promise<DocenteEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'materie', 'appelli'],
    });
  }

  findByUserId(userId: number) {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  findByDipartimento(dipartimento: string) {
    return this.repo.find({ where: { dipartimento }, relations: ['user'] });
  }

  findByMateriaId(materiaId: number) {
    //piu' insegnanti per materia?
    return this.repo.findOne({
      where: { materie: { id: materiaId } },
      relations: ['materie'],
    });
  }

  findAppelliByDocenteId(docenteId: number) {
    return this.repo.find({
      where: { id: docenteId },
      relations: ['appelli', 'appelli.materia', 'appelli.sessione'],
    });
  }

  create(data: { titolo: string; dipartimento: string; userId: number }) {
    const entity = this.repo.create({
      titolo: data.titolo,
      dipartimento: data.dipartimento,
      user: { id: data.userId } as any,
    });
    return this.repo.save(entity);
  }

  async update(id: number, data: UpdateDocenteDto) {
    const payload: any = {};
    if (data.titolo !== undefined) payload.titolo = data.titolo;
    if (data.dipartimento !== undefined)
      payload.dipartimento = data.dipartimento;
    await this.repo.update(id, payload);
    return this.findById(id);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
