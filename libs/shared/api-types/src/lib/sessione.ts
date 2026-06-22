export interface Sessione {
  id: number;
  nome: string;
  dataInizio: string;
  dataFine: string;
  dataInizioInserimento: string;
  dataFineInserimento: string;
}

export interface ICreateSessione {
  nome: string;
  dataInizio: string;
  dataFine: string;
  dataInizioInserimento: string;
  dataFineInserimento: string;
}

export type IUpdateSessione = Partial<ICreateSessione>;
