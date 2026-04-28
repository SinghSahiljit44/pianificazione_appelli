import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { AppelloRepository } from './appello.repository';
import { AppelloEntity } from './appello.entity';
import { SessioneRepository } from '';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';

@Injectable()
export class AppelloService {

    constructor(
        private readonly appelloRepository: AppelloRepository,
        private readonly sessioneRepository: SessioneRepository,
    ) {}

    async findAll(): Promise<AppelloEntity[]> {
        return this.appelloRepository.findAll();
    }

    async findById(id: number): Promise<AppelloEntity> {
        const appello = await this.appelloRepository.findById(id);
        if (!appello) throw new NotFoundException(`Appello con id ${id} non trovato`);
        return appello;
    }

    async create(dto: CreateAppelloDto, docenteId: number): Promise<AppelloEntity> {
        // 1. Verifica esistenza sessione
        const sessione = await this.sessioneRepository.findById(dto.sessioneId);
        if (!sessione) throw new NotFoundException(`Sessione con id ${dto.sessioneId} non trovata`);

        // 2. Vincolo: Finestra temporale di inserimento
        const now = new Date();
        if (now < sessione.inizioInserimento || now > sessione.fineInserimento) {
            throw new BadRequestException('Il periodo di inserimento preferenze è chiuso');
        }

        const dataScelta = new Date(dto.dataOra);

        // 3. Vincolo: No Sabato (6) e Domenica (0)
        const day = dataScelta.getDay();
        if (day === 0 || day === 6) {
            throw new BadRequestException('Non è possibile fissare appelli nei giorni festivi (weekend)');
        }

        // 4. Vincolo: Unicità per aula e giorno (nessuna sovrapposizione)
        const inizioGiorno = new Date(dataScelta);
        inizioGiorno.setHours(0, 0, 0, 0);
        const fineGiorno = new Date(dataScelta);
        fineGiorno.setHours(23, 59, 59, 999);

        const esistente = await this.appelloRepository.findOverlap(dto.aula, inizioGiorno, fineGiorno);
        if (esistente) {
            throw new BadRequestException('Esiste già un appello per questa aula in questa data');
        }

        // 5. Creazione con assegnazione docente (proprietario)
        return this.appelloRepository.create({
            ...dto,
            docenteId,
        });
    }

    async update(id: number, dto: UpdateAppelloDto, docenteId: number): Promise<AppelloEntity> {
        const appello = await this.appelloRepository.findById(id);
        if (!appello) throw new NotFoundException(`Appello con id ${id} non trovato`);

        // 6. Vincolo: Solo il docente proprietario può modificare
        if (appello.docenteId !== docenteId) {
            throw new ForbiddenException('Non puoi modificare un appello non tuo');
        }

        // 7. Vincolo: Modifica permessa solo nel periodo di inserimento
        const now = new Date();
        if (now > appello.sessione.fineInserimento) {
            throw new BadRequestException('Termine scaduto: non puoi più modificare questo appello');
        }

        return this.appelloRepository.update(id, dto);
    }

    async remove(id: number, docenteId: number): Promise<void> {
        const appello = await this.appelloRepository.findById(id);
        if (!appello) throw new NotFoundException(`Appello con id ${id} non trovato`);

        // 8. Vincolo: Solo il docente proprietario può cancellare
        if (appello.docenteId !== docenteId) {
            throw new ForbiddenException('Non puoi cancellare un appello non tuo');
        }

        // 9. Vincolo: Cancellazione permessa solo nel periodo di inserimento
        if (new Date() > appello.sessione.fineInserimento) {
            throw new BadRequestException('Non puoi cancellare un appello dopo la fine del periodo di inserimento');
        }

        const deleted = await this.appelloRepository.delete(id);
        if (!deleted) throw new NotFoundException(`Impossibile eliminare l'appello con id ${id}`);
    }
}