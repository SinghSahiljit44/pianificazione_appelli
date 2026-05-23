import client from '../../api/client';
import { CorsoLaurea, CreateCorsoDiLaureaDto, UpdateCorsoDiLaureaDto } from '@server/corso-di-laurea';

export async function getCorsiLaurea(): Promise<CorsoLaurea[]> {
  const res = await client.get<CorsoLaurea[]>('/corsi-laurea');
  return res.data;
}

export async function createCorsoLaurea(data: CreateCorsoDiLaureaDto): Promise<CorsoLaurea> {
  const res = await client.post<CorsoLaurea>('/corsi-laurea', data);
  return res.data;
}

export async function updateCorsoLaurea(id: number, data: UpdateCorsoDiLaureaDto): Promise<CorsoLaurea> {
  const res = await client.patch<CorsoLaurea>(`/corsi-laurea/${id}`, data);
  return res.data;
}

export async function deleteCorsoLaurea(id: number): Promise<void> {
  await client.delete(`/corsi-laurea/${id}`);
}
