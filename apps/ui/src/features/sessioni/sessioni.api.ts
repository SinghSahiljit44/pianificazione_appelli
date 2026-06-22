import client from '../../api/client';
import type { Sessione, ICreateSessione, IUpdateSessione } from '@shared/api-types';

export type { Sessione };
export type { ICreateSessione as CreateSessioneDto, IUpdateSessione as UpdateSessioneDto };

export async function getSessioni(): Promise<Sessione[]> {
  const res = await client.get<Sessione[]>('/sessioni');
  return res.data;
}

export async function createSessione(data: ICreateSessione): Promise<Sessione> {
  const res = await client.post<Sessione>('/sessioni', data);
  return res.data;
}

export async function updateSessione(id: number, data: IUpdateSessione): Promise<Sessione> {
  const res = await client.patch<Sessione>(`/sessioni/${id}`, data);
  return res.data;
}

export async function deleteSessione(id: number): Promise<void> {
  await client.delete(`/sessioni/${id}`);
}

export async function getSessioniAttivePerInserimento(): Promise<Sessione[]> {
  const res = await client.get<Sessione[]>('/sessioni/attive-per-inserimento');
  return res.data;
}
