import client from '../../api/client';

// Tipi del frontend: forma dei dati scambiati con l'API. Mai importare @server/*.
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthenticatedUser;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}
