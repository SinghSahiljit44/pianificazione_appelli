import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppelloRepository } from './appello.repository';
import { AppelloEntity } from './appello.entity';
import { SessioneEntity, SessioneRepository } from '@server/sessione'; // Assumi esista

@Injectable()
export class AppelloService {
  constructor(
    private readonly repository: AppelloRepository,
    private readonly sessioneRepo: SessioneRepository 
  ) {}

  async create(data: AppelloEntity, docenteId: number) {
    SessioneEntity sessione = await this.sessioneRepo.findById(data.sessione.id);
    if (!sessione) throw new NotFoundException("Sessione non trovata");

    const now = new Date();
    if (now < sessione.inizio_inserimento || now > sessione.fine_inserimento) {
      throw new BadRequestException("Il periodo di inserimento per questa sessione è chiuso");
    }

    const dataScelta = new Date(data.dataOra);

    // 3. Vincolo: No Sabato (6) e Domenica (0)
    const day = dataScelta.getDay();
    if (day === 0 || day === 6) {
      throw new BadRequestException("Non è possibile fissare appelli nei giorni festivi (weekend)");
    }

    // 4. Vincolo: La data dell'appello deve essere interna alla sessione d'esame
    if (dataScelta < sessione.inizio_sessione || dataScelta > sessione.fine_sessione) {
      throw new BadRequestException("La data dell'appello è fuori dal range della sessione d'esame");
    }

    // 5. Vincolo: Unicità per giorno/corso/anno
    // Nota: materia.corsoDiLaurea e materia.anno devono essere passati o caricati
    const duplicato = await this.repository.findDuplicate(
      dataScelta, 
      data.materia.corsoId, 
      data.materia.anno
    );
    if (duplicato) {
      throw new BadRequestException("Esiste già un appello per questo corso in questa data");
    }

    // 6. Assegno il docente (proprietario)
    data.docente = { id: docenteId } as any;

    return this.repository.create(data);
  }

  async update(id: number, data: Partial<AppelloEntity>, docenteId: number) {
    const appello = await this.repository.findById(id);

    // 7. Vincolo: Solo il docente proprietario può modificare
    if (appello.docente.id !== docenteId) {
      throw new ForbiddenException("Non puoi modificare un appello non tuo");
    }

    // 8. Vincolo: Controllo finestra temporale anche per la modifica
    const now = new Date();
    if (now > appello.sessione.dataFine) {
      throw new BadRequestException("Termine scaduto: non puoi più modificare questo appello");
    }

    return this.repository.update(id, data);
  }

  async remove(id: number, docenteId: number) {
    const appello = await this.repository.findById(id);
    
    if (appello.docente.id !== docenteId) {
      throw new ForbiddenException("Non puoi cancellare un appello non tuo");
    }

    // Controllo finestra temporale
    if (new Date() > appello.sessione.dataFine) {
      throw new BadRequestException("Non puoi cancellare un appello dopo la fine del periodo di inserimento");
    }

    return this.repository.delete(id);
  }

  async getAppelliByMateria(materiaId: number) {
    return this.repository.findAllByMateria(materiaId);
  }
}