import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppelloRepository } from './appello.repository';
import { AppelloEntity } from './appello.entity';

@Injectable()
export class AppelloService {
  constructor(private readonly repository: AppelloRepository) {}

  async create(data: Partial<AppelloEntity>) {
    if (data.dataOra && new Date(data.dataOra) < new Date()) {
      throw new BadRequestException("Non puoi creare un appello nel passato"); //potrebbe essere utile un interceptor
    }
    return this.repository.create(data);
  }

  async getAppelliByMateria(materiaId: number) {
    // Logica specifica per filtrare
    return (await this.repository.findAll()).filter(a => a.materiaId === materiaId);
  }

  async remove(id: number) {
    const exists = await this.repository.findById(id);
    if (!exists) throw new NotFoundException("Appello non trovato");
    return this.repository.delete(id);
  }
}