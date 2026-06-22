import client from '../../api/client';
import type { CorsoLaurea, ICreateCorsoLaurea, IUpdateCorsoLaurea } from '@shared/api-types';

export type { CorsoLaurea };
export type { ICreateCorsoLaurea as CreateCorsoLaureaDto, IUpdateCorsoLaurea as UpdateCorsoLaureaDto };

export async function getCorsiLaurea(): Promise<CorsoLaurea[]> {
  const res = await client.get<CorsoLaurea[]>('/corsi-laurea');
  return res.data;
}

export async function createCorsoLaurea(data: ICreateCorsoLaurea): Promise<CorsoLaurea> {
  const res = await client.post<CorsoLaurea>('/corsi-laurea', data);
  return res.data;
}

export async function updateCorsoLaurea(id: number, data: IUpdateCorsoLaurea): Promise<CorsoLaurea> {
  const res = await client.patch<CorsoLaurea>(`/corsi-laurea/${id}`, data);
  return res.data;
}

export async function deleteCorsoLaurea(id: number): Promise<void> {
  await client.delete(`/corsi-laurea/${id}`);
}
