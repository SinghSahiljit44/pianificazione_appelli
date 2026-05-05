// libs/academic/corso-di-laurea/src/lib/corso-di-laurea.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CorsoDiLaureaRepository } from './corso-di-laurea.repository';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';
import { CreateCorsoDiLaureaDto } from './dto/createcorsodilaurea.dto';
import { UpdateCorsoDiLaureaDto } from './dto/updatecorsodilaurea.dto';

@Injectable()
export class CorsoDiLaureaService {
  constructor(private readonly repository: CorsoDiLaureaRepository) {}

  async getById(id: number): Promise<CorsoDiLaureaEntity> {
    const corso = await this.repository.findById(id);
    if (!corso) throw new NotFoundException(`Corso di laurea ${id} non trovato`);
    return corso;
  }

  getAll(): Promise<CorsoDiLaureaEntity[]> {
    return this.repository.findAll();
  }

  async create(data: CreateCorsoDiLaureaDto): Promise<CorsoDiLaureaEntity> {
    const existing = await this.repository.findByNome(data.nome);
    if (existing) throw new ConflictException(`Corso di laurea con nome ${data.nome} già esistente`);
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateCorsoDiLaureaDto) {
    await this.getById(id);
    if (data.nome) {
      const existing = await this.repository.findByNome(data.nome);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Impossibile rinominare: il corso "${data.nome}" esiste già (ID: ${existing.id})`
        );
      }
    }
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    await this.getById(id);
    return this.repository.delete(id);
  }
}