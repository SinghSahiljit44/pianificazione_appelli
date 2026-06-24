import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity } from '@server/academic-entities';
import { CreateSessioneDto } from './dto/createsessione.dto';
import { UpdateSessioneDto } from './dto/updatesessione.dto';

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

  async getAttiva(): Promise<SessioneEntity> {
    const sessione = await this.repository.findAttiva();
    if (!sessione) throw new NotFoundException('Nessuna sessione attiva');
    return sessione;
  }

  getAttive(): Promise<SessioneEntity[]> {
    return this.repository.findAttive();
  }

  async isSessioneOpen(sessioneId: number): Promise<boolean> {
    const sessione = await this.getById(sessioneId);
    const now = new Date();
    return now >= new Date(sessione.dataInizio) && now <= new Date(sessione.dataFine);
  }

  getWithAppelli() {
    return this.repository.findWithAppelli();
  }

  async create(data: CreateSessioneDto): Promise<SessioneEntity> {
    const dataInizio = new Date(data.dataInizio);
    const dataFine = new Date(data.dataFine);
    const dataInizioInserimento = new Date(data.dataInizioInserimento);
    const dataFineInserimento = new Date(data.dataFineInserimento);

    this.checkDateConsistency(dataInizio, dataFine, dataInizioInserimento, dataFineInserimento);
    await this.checkOverlap(dataInizio, dataFine);
    return this.repository.create({
      nome: data.nome,
      dataInizio,
      dataFine,
      dataInizioInserimento,
      dataFineInserimento,
    });
  }

  async update(id: number, data: UpdateSessioneDto) {
    const sessione = await this.getById(id);

    const dataInizio = data.dataInizio ? new Date(data.dataInizio) : new Date(sessione.dataInizio);
    const dataFine = data.dataFine ? new Date(data.dataFine) : new Date(sessione.dataFine);
    const inizioIns = data.dataInizioInserimento ? new Date(data.dataInizioInserimento) : new Date(sessione.dataInizioInserimento);
    const fineIns = data.dataFineInserimento ? new Date(data.dataFineInserimento) : new Date(sessione.dataFineInserimento);

    this.checkDateConsistency(dataInizio, dataFine, inizioIns, fineIns);
    await this.checkOverlap(dataInizio, dataFine, id);

    return this.repository.update(id, {
      ...(data.nome !== undefined && { nome: data.nome }),
      ...(data.dataInizio !== undefined && { dataInizio }),
      ...(data.dataFine !== undefined && { dataFine }),
      ...(data.dataInizioInserimento !== undefined && { dataInizioInserimento: inizioIns }),
      ...(data.dataFineInserimento !== undefined && { dataFineInserimento: fineIns }),
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return this.repository.delete(id);
  }

  private checkDateConsistency(
    dataInizio: Date,
    dataFine: Date,
    inizioInserimento: Date,
    fineInserimento: Date
  ) {
    if (dataInizio >= dataFine) {
      throw new BadRequestException('La data di inizio sessione deve essere precedente alla fine');
    }
    if (inizioInserimento >= fineInserimento) {
      throw new BadRequestException('La data di inizio inserimento deve essere precedente alla fine');
    }
    if (fineInserimento >= dataInizio) {
      throw new BadRequestException('La fine del periodo di inserimento non può superare l\'inizio della sessione');
    }
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    inizioInserimento.setHours(0, 0, 0, 0);

    if (inizioInserimento < oggi) {
      throw new BadRequestException('La data di inizio inserimento non può essere nel passato');
    }
  }

  private async checkOverlap(dataInizio: Date, dataFine: Date, excludeId?: number) {
    const sovrapposizione = await this.repository.existsOverlap(dataInizio, dataFine, excludeId);
    
    if (sovrapposizione) {
      throw new BadRequestException('La sessione si sovrappone con una sessione esistente');
    }
  }
}