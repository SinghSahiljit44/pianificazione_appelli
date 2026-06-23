import type { Docente } from './docente';
import type { Sessione } from './sessione';

export interface Appello {
  id: number;
  data: string;
  ora: string;
  aula: string;
  note?: string;
  sessione: Sessione;
  materia: {
    id: number;
    nome: string;
    cfu: number;
    docente?: Docente;
    corsi: { id: number; anno: number; corso: { id: number; nome: string } }[] | null;
  };
  docente: Docente;
}

export interface ICreateAppello {
  data: string;
  ora: string;
  aula: string;
  note?: string;
  materiaId: number;
  sessioneId: number;
}

export type IUpdateAppello = Partial<ICreateAppello>;
