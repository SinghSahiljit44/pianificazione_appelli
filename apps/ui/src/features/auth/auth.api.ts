import client from '../../api/client';
import type { AuthResponse } from '@server/auth';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}
