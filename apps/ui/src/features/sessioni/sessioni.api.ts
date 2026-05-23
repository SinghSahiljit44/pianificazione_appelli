import client from '../../api/client';
import { Sessione, CreateSessioneDto, UpdateSessioneDto } from '@server/sessione';

export async function getSessioni(): Promise<Sessione[]> {
  const res = await client.get<Sessione[]>('/sessioni');
  return res.data;
}

export async function createSessione(data: CreateSessioneDto): Promise<Sessione> {
  const res = await client.post<Sessione>('/sessioni', data);
  return res.data;
}

export async function updateSessione(id: number, data: UpdateSessioneDto): Promise<Sessione> {
  const res = await client.patch<Sessione>(`/sessioni/${id}`, data);
  return res.data;
}

export async function deleteSessione(id: number): Promise<void> {
  await client.delete(`/sessioni/${id}`);
}

export async function getSessioneAttivaPerInserimento(): Promise<Sessione | null> {
  try {
    const res = await client.get<Sessione>('/sessioni/attiva-per-inserimento');
    return res.data;
  } catch {
    return null;
  }
}
