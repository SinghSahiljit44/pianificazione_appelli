import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity } from './sessione.entity';
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

  getWithAppelli() {
    return this.repository.findWithAppelli();
  }

  async isSessioneOpen(sessioneId: number): Promise<boolean> {
    const sessione = await this.getById(sessioneId);
    const now = new Date();
    return now >= sessione.dataInizioInserimento && now <= sessione.dataFineInserimento;
  }

  async create(data: CreateSessioneDto): Promise<SessioneEntity> {
    this.checkDateConsistency(
      data.dataInizio,
      data.dataFine,
      data.dataInizioInserimento,
      data.dataFineInserimento
    );
    await this.checkOverlap(data.dataInizio, data.dataFine);
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateSessioneDto) {
    const sessione = await this.getById(id);

    const dataInizio = data.dataInizio ?? sessione.dataInizio;
    const dataFine = data.dataFine ?? sessione.dataFine;
    const inizioIns = data.dataInizioInserimento ?? sessione.dataInizioInserimento;
    const fineIns = data.dataFineInserimento ?? sessione.dataFineInserimento;

    this.checkDateConsistency(dataInizio, dataFine, inizioIns, fineIns);
    await this.checkOverlap(dataInizio, dataFine, id);

    return this.repository.update(id, data);
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
    if (fineInserimento > dataFine) {
      throw new BadRequestException('La fine del periodo di inserimento non può superare la fine della sessione');
    }
  }

  //Metodo senza problemi di performance
  private async checkOverlap(dataInizio: Date, dataFine: Date, excludeId?: number) {
    const sovrapposizione = await this.repository.existsOverlap(dataInizio, dataFine, excludeId);
    
    if (sovrapposizione) {
      throw new BadRequestException('La sessione si sovrappone con una sessione esistente');
    }
  }
}