// Read-model
export interface CorsoLaurea {
  id: number;
  nome: string;
  descrizione?: string;
  durataAnni: number;
}

export interface ICreateCorsoLaurea {
  nome: string;
  descrizione?: string;
  durataAnni?: number;
}

export type IUpdateCorsoLaurea = Partial<ICreateCorsoLaurea>;
