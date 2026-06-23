import client from '../../api/client';
import type { Appello, ICreateAppello, IUpdateAppello } from '@shared/api-types';

export type { Appello };
export type { ICreateAppello as CreateAppelloDto, IUpdateAppello as UpdateAppelloDto };

export async function getMieiAppelli(): Promise<Appello[]> {
  const res = await client.get<Appello[]>('/appelli/miei');
  return res.data;
}

export async function getAllAppelli(): Promise<Appello[]> {
  const res = await client.get<Appello[]>('/appelli');
  return res.data;
}

export async function getAppelliBySessione(sessioneId: number): Promise<Appello[]> {
  const res = await client.get<Appello[]>(`/appelli/sessione/${sessioneId}`);
  return res.data;
}

export async function createAppello(data: ICreateAppello): Promise<Appello> {
  const res = await client.post<Appello>('/appelli', data);
  return res.data;
}

export async function updateAppello(id: number, data: IUpdateAppello): Promise<Appello> {
  const res = await client.patch<Appello>(`/appelli/${id}`, data);
  return res.data;
}

export async function deleteAppello(id: number): Promise<void> {
  await client.delete(`/appelli/${id}`);
}
