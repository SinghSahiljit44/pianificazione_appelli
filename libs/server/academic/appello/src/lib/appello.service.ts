import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppelloRepository } from './appello.repository';
import { SessioneService } from '@server/sessione';
import { CreateAppelloDto } from './dto/create-appello.dto';
import { UpdateAppelloDto } from './dto/update-appello.dto';
import { MateriaService } from '@server/materia';

@Injectable()
export class AppelloService {
  constructor(
    private readonly repository: AppelloRepository,
    private readonly sessioneService: SessioneService,
    private readonly materiaService: MateriaService,
  ) {}

  async create(dataDTO: CreateAppelloDto, docenteId: number) {
    await this.checkValidityForAppello(dataDTO.sessioneId, dataDTO.data);
    await this.checkDuplicateAppello(dataDTO.data, dataDTO.materiaId);
    await this.checkDuplicateAppelloForDocente(dataDTO.data, docenteId);

    return this.repository.create({ ...dataDTO, docenteId });
  }

  async update(id: number, dataDTO: UpdateAppelloDto, docenteId: number) {
    const appello = await this.getById(id);

    if (appello.docente.id !== docenteId) {
      throw new ForbiddenException('Non puoi modificare un appello che non è tuo');
    }

    await this.checkValidityForAppello(dataDTO.sessioneId ?? appello.sessione.id, 
                                        dataDTO.data ?? appello.data);
    
    if (dataDTO.data || dataDTO.materiaId) {
      await this.checkDuplicateAppello(
            dataDTO.data ?? appello.data, 
            dataDTO.materiaId ?? appello.materia.id, 
            id
          );
    }
    
    if (dataDTO.data) {
      await this.checkDuplicateAppelloForDocente(dataDTO.data, docenteId, id);
    }


    return this.repository.update(id, dataDTO);
  }

  async remove(id: number, docenteId: number) {
    const appello = await this.getById(id);

    if (appello.docente.id !== docenteId) { //TODO potrebbe farlo anche la segreteria!!
      throw new ForbiddenException('Non puoi cancellare un appello che non è tuo');
    }

    if (new Date() > appello.sessione.dataFineInserimento) {
      throw new BadRequestException('Non puoi cancellare un appello dopo la chiusura del periodo di inserimento');
    }

    return this.repository.delete(id);
  }


  private async checkValidityForAppello(sessioneId: number, dataOra: Date){
    const sessione = await this.sessioneService.getById(sessioneId);

    const now = new Date();
    if (now < sessione.dataInizioInserimento || now > sessione.dataFineInserimento) {
      throw new BadRequestException('Il periodo di inserimento per questa sessione è chiuso');
    }

    const giorno = dataOra.getDay();
    if (giorno === 0 || giorno === 6) {
      throw new BadRequestException('Non è possibile fissare appelli nel weekend');
    }
    if (dataOra < new Date(sessione.dataInizio) || dataOra > new Date(sessione.dataFine)) {
      throw new BadRequestException("La data dell'appello è fuori dal range della sessione");
    }
  }


  //TODO controllare logica di duplicato, in quanto materia collegata a piu' corsi
  private async checkDuplicateAppello(dataScelta: Date, materiaId: number, excludeId?: number) {
    const corsi: number[] = await this.materiaService.getCorsiIDsByMateria(materiaId);
    if (corsi.length === 0) {
      throw new BadRequestException('La materia non è associata a nessun corso'); //grave
    }
    for (const corsoId of corsi) {
      const materiaCorso = await this.materiaService.getMateriaCorso(materiaId, corsoId);
      if (!materiaCorso) throw new BadRequestException('Materia non associata a questo corso');
      const anno = materiaCorso.anno;
      const duplicato = await this.repository.findDuplicate(dataScelta, corsoId, anno, excludeId);
      if (duplicato) {
        throw new BadRequestException('Esiste già un appello per questo corso e anno in questa data');
      }
    }

  }

  private async checkDuplicateAppelloForDocente(dataScelta: Date, docenteId: number, excludeId?: number) {
    const appelli = await this.repository.findAllByDocente(docenteId);
    const giorno = dataScelta.toDateString();
    const conflitto = appelli.some(a =>
      a.id !== excludeId && new Date(a.data).toDateString() === giorno
    );
    if (conflitto) {
      throw new BadRequestException('Hai già un appello fissato in questa data');
    }
  }



  getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const appello = await this.repository.findById(id);
    if (!appello) throw new NotFoundException(`Appello ${id} non trovato`);
    return appello;
  }

  getByDocente(docenteId: number) {
    return this.repository.findAllByDocente(docenteId);
  }

  getBySessione(sessioneId: number) {
    return this.repository.findAllBySessione(sessioneId);
  }

  getByMateria(materiaId: number) {
    return this.repository.findAllByMateria(materiaId);
  }

  getByCourse(corsoId: number) {
    return this.repository.findByCourseId(corsoId);
  }
}
