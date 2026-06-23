import type { Docente } from './docente';

export interface MateriaCorso {
  id: number;
  anno: number;
  corso: { id: number; nome: string; descrizione?: string; durataAnni: number };
}

export interface Materia {
  id: number;
  nome: string;
  cfu: number;
  docente?: Docente;
  corsi: MateriaCorso[] | null;
}

export interface IMateriaCorsoInput {
  corsoId: number;
  anno: number;
}

export interface ICreateMateria {
  nome: string;
  cfu: number;
  docenteId?: number;
  corsi: IMateriaCorsoInput[];
}

export type IUpdateMateria = Partial<ICreateMateria>;
