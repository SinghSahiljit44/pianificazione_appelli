import client from '../../api/client';
import type { CreateMateriaDto, UpdateMateriaDto, MateriaListItem as Materia } from '@server/materia';

export type { CreateMateriaDto, UpdateMateriaDto, Materia };

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
