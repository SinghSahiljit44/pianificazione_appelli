import { DocenteListItem } from '@server/docente';
import { SessioneListItem } from '@server/sessione';

export interface AppelloListItem {
  id: number;
  data: Date;
  ora: string;
  aula: string;
  note?: string;
  sessione: SessioneListItem;
  materia: {
    id: number;
    nome: string;
    cfu: number;
    docente?: DocenteListItem;
    corsi: { id: number; anno: number; corso: { id: number; nome: string } }[] | null;
  };
  docente: DocenteListItem;
}