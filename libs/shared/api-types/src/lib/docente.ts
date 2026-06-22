// Read-model
export interface DocenteUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Docente {
  id: number;
  titolo: string;
  dipartimento: string;
  user: DocenteUser;
}

export interface ICreateDocente {
  titolo: string;
  dipartimento: string;
  name: string;
  email: string;
  password: string;
}

export interface IUpdateDocente {
  titolo?: string;
  dipartimento?: string;
}
