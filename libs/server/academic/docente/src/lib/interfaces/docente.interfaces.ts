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

