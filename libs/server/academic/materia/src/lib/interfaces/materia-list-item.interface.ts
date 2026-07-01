import { DocenteListItem as Docente } from '@server/docente';

export interface MateriaCorso {
  id: number;
  anno: number;
  corso: { id: number; nome: string; descrizione?: string; durataAnni: number };
}

export interface MateriaListItem {
  id: number;
  nome: string;
  cfu: number;
  docente?: Docente;
  corsi: MateriaCorso[] | null;
}