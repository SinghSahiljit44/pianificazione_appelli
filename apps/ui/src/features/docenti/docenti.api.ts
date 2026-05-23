import client from '../../api/client';
import { Docente, CreateDocenteDto, UpdateDocenteDto } from '@server/docente';

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
