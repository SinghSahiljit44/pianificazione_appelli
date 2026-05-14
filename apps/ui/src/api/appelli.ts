import client from './client';
import type { Sessione } from './sessioni';
import type { Materia } from './materie';
import type { Docente } from './docenti';

export interface Appello {
  id: number;
  data: string;
  ora: string;
  aula: string;
  note?: string;
  sessione: Sessione;
  materia: Materia;
  docente: Docente;
}

export interface CreateAppelloDto {
  data: string;
  ora: string;
  aula: string;
  note?: string;
  materiaId: number;
  sessioneId: number;
}

export async function getMieiAppelli(): Promise<Appello[]> {
  const res = await client.get<Appello[]>('/appelli/miei');
  return res.data;
}

export async function createAppello(data: CreateAppelloDto): Promise<Appello> {
  const res = await client.post<Appello>('/appelli', data);
  return res.data;
}

export async function updateAppello(id: number, data: Partial<CreateAppelloDto>): Promise<Appello> {
  const res = await client.patch<Appello>(`/appelli/${id}`, data);
  return res.data;
}

export async function deleteAppello(id: number): Promise<void> {
  await client.delete(`/appelli/${id}`);
}
