import client from './client';

export interface CorsoLaurea {
  id: number;
  nome: string;
  descrizione?: string;
  durataAnni: number;
}

export interface CreateCorsoLaureaDto {
  nome: string;
  descrizione?: string;
  durataAnni?: number;
}

export async function getCorsiLaurea(): Promise<CorsoLaurea[]> {
  const res = await client.get<CorsoLaurea[]>('/corsi-laurea');
  return res.data;
}

export async function createCorsoLaurea(data: CreateCorsoLaureaDto): Promise<CorsoLaurea> {
  const res = await client.post<CorsoLaurea>('/corsi-laurea', data);
  return res.data;
}

export async function updateCorsoLaurea(id: number, data: Partial<CreateCorsoLaureaDto>): Promise<CorsoLaurea> {
  const res = await client.patch<CorsoLaurea>(`/corsi-laurea/${id}`, data);
  return res.data;
}

export async function deleteCorsoLaurea(id: number): Promise<void> {
  await client.delete(`/corsi-laurea/${id}`);
}
