// libs/academic/sessione/src/lib/sessione.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity } from './sessione.entity';

@Injectable()
export class SessioneService {
  constructor(private readonly repository: SessioneRepository) {}

  async create(data: Partial<SessioneEntity>) {
    if (data.dataInizio && data.dataFine && new Date(data.dataInizio) > new Date(data.dataFine)) {
      throw new BadRequestException("La data di inizio non può essere successiva alla fine");
    }
    return this.repository.create(data);
  }

  async getActiveSession() {
    const attiva = await this.repository.findAttiva();
    if (!attiva) throw new NotFoundException("Nessuna sessione attiva trovata");
    return attiva;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}