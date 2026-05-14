import client from './client';

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

export interface CreateDocenteDto {
  titolo: string;
  dipartimento: string;
  name: string;
  email: string;
  password: string;
  role: 'USER';
}

export interface UpdateDocenteDto {
  titolo?: string;
  dipartimento?: string;
}

export async function getDocenti(): Promise<Docente[]> {
  const res = await client.get<Docente[]>('/docenti');
  return res.data;
}

export async function createDocente(data: CreateDocenteDto): Promise<Docente> {
  const res = await client.post<Docente>('/docenti', data);
  return res.data;
}

export async function updateDocente(id: number, data: UpdateDocenteDto): Promise<Docente> {
  const res = await client.patch<Docente>(`/docenti/${id}`, data);
  return res.data;
}

export async function deleteDocente(id: number): Promise<void> {
  await client.delete(`/docenti/${id}`);
}

export async function getDocenteMe(): Promise<Docente> {
  const res = await client.get<Docente>('/docenti/me');
  return res.data;
}
