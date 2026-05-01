// libs/academic/sessione/src/lib/sessione.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity } from './sessione.entity';

@Injectable()
export class SessioneService {
  constructor(private readonly repository: SessioneRepository) {}

  async getById(id: number): Promise<SessioneEntity> {
    const sessione = await this.repository.findById(id);
    if (!sessione) throw new NotFoundException(`Sessione ${id} non trovata`);
    return sessione;
  }
  
  getAll(): Promise<SessioneEntity[]> {
    return this.repository.findAll();
  }

  async isSessioneOpen(sessioneId: number): Promise<boolean> {
    const sessione = await this.getById(sessioneId);
    const now = new Date();
    return now >= sessione.inizioInserimento && now <= sessione.fineInserimento;
  }
}