export interface DocenteUser {
  id: number; //UserID
  name: string; 
  email: string;
  role: string; //user?
}

export interface DocenteListItem {
  id: number;
  titolo: string;
  dipartimento: string;
  user: DocenteUser;
}