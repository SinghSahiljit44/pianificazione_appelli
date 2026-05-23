export interface Appello {
  id: number;
  data: string;
  ora: string;
  aula: string;
  note?: string;
  sessione: {
    id: number;
    nome: string;
    dataInizio: string;
    dataFine: string;
    dataInizioInserimento: string;
    dataFineInserimento: string;
  };
  materia: {
    id: number;
    nome: string;
    cfu: number;
    docente?: { id: number; titolo: string; dipartimento: string; user: { id: number; name: string; email: string; role: string; }; };
    corsi: { id: number; anno: number; corso: { id: number; nome: string; }; }[] | null;
  };
  docente: { id: number; titolo: string; dipartimento: string; user: { id: number; name: string; email: string; role: string; }; };
}

