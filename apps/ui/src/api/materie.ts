import client from './client';
import type { Docente } from './docenti';
import type { CorsoLaurea } from './corsi-laurea';

export interface MateriaCorso {
  id: number;
  anno: number;
  corso: CorsoLaurea;
}

export interface Materia {
  id: number;
  nome: string;
  cfu: number;
  docente?: Docente;
  corsi: MateriaCorso[] | null;
}

export interface CorsoAnnoDto {
  corsoId: number;
  anno: number;
}

export interface CreateMateriaDto {
  nome: string;
  cfu: number;
  docenteId?: number;
  corsi: CorsoAnnoDto[];
}

export interface UpdateMateriaDto {
  nome?: string;
  cfu?: number;
  docenteId?: number;
  corsi?: CorsoAnnoDto[];
}

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
