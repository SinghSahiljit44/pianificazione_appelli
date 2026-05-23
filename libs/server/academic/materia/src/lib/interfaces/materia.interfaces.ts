export interface MateriaCorso {
  id: number;
  anno: number;
  corso: { id: number; nome: string; descrizione?: string; durataAnni: number; };
}

export interface Materia {
  id: number;
  nome: string;
  cfu: number;
  docente?: { id: number; titolo: string; dipartimento: string; user: { id: number; name: string; email: string; role: string; }; };
  corsi: MateriaCorso[] | null;
}

