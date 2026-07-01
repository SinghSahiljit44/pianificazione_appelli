import client from '../../api/client';
import type { CreateMateriaDto, UpdateMateriaDto } from '@server/materia';
import { Docente } from '../docenti/docenti.api';

export interface MateriaCorso {
  id: number;
  anno: number;
  corso: { id: number; nome: string; descrizione?: string; durataAnni: number };
}

export interface Materia {
  id: number;
  nome: string;
  cfu: number;
  docente?: Docente;
  corsi: MateriaCorso[] | null;
}

export type { CreateMateriaDto, UpdateMateriaDto };

export async function getMaterie(): Promise<Materia[]> {
  const res = await client.get<Materia[]>('/materie');
  return res.data;
}

export async function createMateria(data: CreateMateriaDto): Promise<Materia> {
  const res = await client.post<Materia>('/materie', data);
  return res.data;
}

export async function updateMateria(id: number, data: UpdateMateriaDto): Promise<Materia> {
  const res = await client.patch<Materia>(`/materie/${id}`, data);
  return res.data;
}

export async function deleteMateria(id: number): Promise<void> {
  await client.delete(`/materie/${id}`);
}

export async function getMaterieByDocente(docenteId: number): Promise<Materia[]> {
  const res = await client.get<Materia[]>(`/materie/docente/${docenteId}`);
  return res.data;
}
