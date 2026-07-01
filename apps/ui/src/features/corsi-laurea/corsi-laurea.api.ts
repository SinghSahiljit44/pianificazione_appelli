import client from '../../api/client';
import type { CreateCorsoDiLaureaDto, UpdateCorsoDiLaureaDto, CorsoLaureaListItem as CorsoDiLaurea } from '@server/corso-di-laurea';

export async function getCorsiLaurea(): Promise<CorsoDiLaurea[]> {
  const res = await client.get<CorsoDiLaurea[]>('/corsi-laurea');
  return res.data;
}

export async function createCorsoLaurea(data: CreateCorsoDiLaureaDto): Promise<CorsoDiLaurea> {
  const res = await client.post<CorsoDiLaurea>('/corsi-laurea', data);
  return res.data;
}

export async function updateCorsoLaurea(id: number, data: UpdateCorsoDiLaureaDto): Promise<CorsoDiLaurea> {
  const res = await client.patch<CorsoDiLaurea>(`/corsi-laurea/${id}`, data);
  return res.data;
}

export async function deleteCorsoLaurea(id: number): Promise<void> {
  await client.delete(`/corsi-laurea/${id}`);
}
