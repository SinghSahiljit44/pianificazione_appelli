import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { MateriaRepository } from './materia.repository';
import { CreateMateriaDto } from './dto/createmateria.dto';
import { UpdateMateriaDto } from './dto/updatemateria.dto';
import { DocenteService } from '@server/docente';
import { CorsoDiLaureaService } from '@server/corso-di-laurea';

@Injectable()
export class MateriaService {
  constructor(
    private readonly repository: MateriaRepository,
    private readonly docenteService: DocenteService,
    private readonly corsoDiLaureaService: CorsoDiLaureaService,
  ) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getByDocenteId(docenteId: number) {
    const materie = await this.repository.findByDocenteId(docenteId);
    if (!materie || materie.length === 0) throw new NotFoundException(`Materia con docente ${docenteId} non trovata`);
    return materie;
  }

  async getByCorsoId(corsoId: number) {
    const materie = await this.repository.findByCorsoId(corsoId);
    if (!materie || materie.length === 0) throw new NotFoundException(`Nessuna materia trovata per il corso ${corsoId}`);
    return materie;
  }

  async getWithAppelli(id: number) {
    const materia = await this.repository.findWithAppelli(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return materia;
  }

  async getCorsiIDsByMateria(materiaId: number): Promise<number[]>{
    const materia = await this.repository.findById(materiaId);
    if (!materia) throw new NotFoundException(`Materia ${materiaId} non trovata`);
    return materia.corsi.map(c => c.corso.id);
  }

  async getMateriaCorso(materiaId: number, corsoId: number) {
    return this.repository.findMateriaCorso(materiaId, corsoId);
  }

  async getOne(id: number) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return materia;
  }

  async create(data: CreateMateriaDto) {
    const combinations = data.corsi.map(c => `${c.corsoId}-${c.anno}`);
    const hasDuplicates = new Set(combinations).size !== combinations.length;
    if (hasDuplicates) throw new ConflictException("L'elenco dei corsi contiene duplicati (stesso corso e stesso anno).");

    if (data.docenteId !== undefined) await this.docenteService.getOne(data.docenteId);
    await Promise.all(data.corsi.map(async c => {
      const corso = await this.corsoDiLaureaService.getById(c.corsoId);
      if (c.anno < 1 || c.anno > corso.durataAnni) {
        throw new BadRequestException(`Anno ${c.anno} non valido per il corso "${corso.nome}" (durata: ${corso.durataAnni} anni)`);
      }
    }));

    return this.repository.create(data);
  }

  async update(id: number, data: UpdateMateriaDto) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);

    if (data.docenteId !== undefined) await this.docenteService.getOne(data.docenteId);
    if (data.corsi?.length) await Promise.all(data.corsi.map(async c => {
      const corso = await this.corsoDiLaureaService.getById(c.corsoId);
      if (c.anno < 1 || c.anno > corso.durataAnni) {
        throw new BadRequestException(`Anno ${c.anno} non valido per il corso "${corso.nome}" (durata: ${corso.durataAnni} anni)`);
      }
    }));

    if (data.corsi !== undefined) {
      const esistenti = new Set(
        materia.corsi.map((mc) => `${mc.corso.id}-${mc.anno}`),
      );
      const aggiunte = data.corsi.filter(
        (c) => !esistenti.has(`${c.corsoId}-${c.anno}`),
      );
      for (const c of aggiunte) {
        await this.checkAppelloConflittiPerAssociazione(id, c.corsoId, c.anno);
      }
    }

    return this.repository.update(id, data);
  }

  async remove(id: number) {
    const materia = await this.repository.findById(id);
    if (!materia) throw new NotFoundException(`Materia ${id} non trovata`);
    return this.repository.delete(id);
  }

  async addMateriaToCorso(materiaId: number, corsoId: number, anno: number) {
    const existing = await this.repository.findMateriaCorsoSpecific(materiaId, corsoId, anno);

    if (existing) {
      throw new ConflictException(
        `La materia ${materiaId} è già associata al corso ${corsoId} per l'anno ${anno}`
      );
    }

    await this.checkAppelloConflittiPerAssociazione(materiaId, corsoId, anno);

    return this.repository.addCorso(materiaId, corsoId, anno);
  }

  private async checkAppelloConflittiPerAssociazione(
    materiaId: number,
    corsoId: number,
    anno: number,
  ) {
    const conflitti =
      await this.repository.findAppelliInConflittoPerAssociazione(
        materiaId,
        corsoId,
        anno,
      );
    if (conflitti.length === 0) return;

    const corso = await this.corsoDiLaureaService.getById(corsoId);
    const date = [
      ...new Set(
        conflitti.map((a) => new Date(a.data).toLocaleDateString('it-IT')),
      ),
    ].join(', ');

    throw new BadRequestException(
      `Impossibile associare la materia al corso "${corso.nome}" (anno ${anno}): ` +
        `per quel corso e anno esistono già appelli nelle stesse date in cui questa materia ne ha uno (${date}), ` +
        'creando due appelli lo stesso giorno. Gli appelli vanno prima spostati o rimossi dai docenti.',
    );
  }

  async removeMateriaFromCorso(materiaId: number, corsoId: number) {
    await this.getOne(materiaId);
    return this.repository.removeCorso(materiaId, corsoId);
  }
}