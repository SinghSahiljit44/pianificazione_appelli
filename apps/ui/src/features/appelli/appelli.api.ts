import client from '../../api/client';
import type { CreateAppelloDto, UpdateAppelloDto } from '@server/appello';
import { Docente } from '../docenti/docenti.api';
import { Sessione } from '../sessioni/sessioni.api';

export interface Appello {
  id: number;
  data: Date;
  ora: string;
  aula: string;
  note?: string;
  sessione: Sessione;
  materia: {
    id: number;
    nome: string;
    cfu: number;
    docente?: Docente;
    corsi: { id: number; anno: number; corso: { id: number; nome: string } }[] | null;
  };
  docente: Docente;
}

export type { CreateAppelloDto as CreateAppelloDto, UpdateAppelloDto as UpdateAppelloDto };

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

export async function createAppello(data: CreateAppelloDto): Promise<Appello> {
  const res = await client.post<Appello>('/appelli', data);
  return res.data;
}

export async function updateAppello(id: number, data: UpdateAppelloDto): Promise<Appello> {
  const res = await client.patch<Appello>(`/appelli/${id}`, data);
  return res.data;
}

export async function deleteAppello(id: number): Promise<void> {
  await client.delete(`/appelli/${id}`);
}
