import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SessioneRepository } from './sessione.repository';
import { SessioneEntity, parseDay } from '@server/academic-entities';
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
    const oggi = parseDay(new Date());
    return (
      oggi >= parseDay(sessione.dataInizio) && oggi <= parseDay(sessione.dataFine)
    );
  }

  getWithAppelli() {
    return this.repository.findWithAppelli();
  }

  async create(data: CreateSessioneDto): Promise<SessioneEntity> {
    const dataInizio = parseDay(data.dataInizio);
    const dataFine = parseDay(data.dataFine);
    const dataInizioInserimento = parseDay(data.dataInizioInserimento);
    const dataFineInserimento = parseDay(data.dataFineInserimento);

    this.checkDateConsistency(
      dataInizio,
      dataFine,
      dataInizioInserimento,
      dataFineInserimento,
    );
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

    const dataInizio = parseDay(data.dataInizio ?? sessione.dataInizio);
    const dataFine = parseDay(data.dataFine ?? sessione.dataFine);
    const inizioIns = parseDay(data.dataInizioInserimento ?? sessione.dataInizioInserimento);
    const fineIns = parseDay(data.dataFineInserimento ?? sessione.dataFineInserimento);

    this.checkDateConsistency(dataInizio, dataFine, inizioIns, fineIns);
    await this.checkOverlap(dataInizio, dataFine, id);

    if (data.dataInizio !== undefined || data.dataFine !== undefined) {
      await this.checkAppelliWithinRange(id, dataInizio, dataFine);
    }

    return this.repository.update(id, {
      ...(data.nome !== undefined && { nome: data.nome }),
      ...(data.dataInizio !== undefined && { dataInizio }),
      ...(data.dataFine !== undefined && { dataFine }),
      ...(data.dataInizioInserimento !== undefined && {
        dataInizioInserimento: inizioIns,
      }),
      ...(data.dataFineInserimento !== undefined && {
        dataFineInserimento: fineIns,
      }),
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
    fineInserimento: Date,
  ) {
    if (dataInizio >= dataFine) {
      throw new BadRequestException(
        'La data di inizio sessione deve essere precedente alla fine',
      );
    }
    if (inizioInserimento >= fineInserimento) {
      throw new BadRequestException(
        'La data di inizio inserimento deve essere precedente alla fine',
      );
    }
    if (fineInserimento >= dataInizio) {
      throw new BadRequestException(
        "La fine del periodo di inserimento non può superare l'inizio della sessione",
      );
    }
    if (inizioInserimento < parseDay(new Date())) {
      throw new BadRequestException(
        'La data di inizio inserimento non può essere nel passato',
      );
    }
  }

  private async checkOverlap(
    dataInizio: Date,
    dataFine: Date,
    excludeId?: number,
  ) {
    const sovrapposizione = await this.repository.existsOverlap(
      dataInizio,
      dataFine,
      excludeId,
    );

    if (sovrapposizione) {
      throw new BadRequestException(
        'La sessione si sovrappone con una sessione esistente',
      );
    }
  }

  private async checkAppelliWithinRange(
    sessioneId: number,
    dataInizio: Date,
    dataFine: Date,
  ) {
    const fuoriRange = await this.repository.findAppelliFuoriRange(
      sessioneId,
      dataInizio,
      dataFine,
    );
    if (fuoriRange.length === 0) return;

    const date = [
      ...new Set(
        fuoriRange.map((a) => new Date(a.data).toLocaleDateString('it-IT')),
      ),
    ].join(', ');
    const sostantivo = fuoriRange.length === 1 ? 'appello' : 'appelli';

    throw new BadRequestException(
      `Le nuove date lascerebbero ${fuoriRange.length} ${sostantivo} fuori dalla sessione (${date}). ` +
        'Scegli un intervallo che li comprenda: gli appelli possono essere rimossi solo dai docenti, ' +
        'mentre il periodo di inserimento è aperto.',
    );
  }
}
