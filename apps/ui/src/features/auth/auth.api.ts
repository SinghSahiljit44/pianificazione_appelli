import client from '../../api/client';

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
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

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return res.data;
}

export async function changePassword(data: ChangePasswordDTO): Promise<void> {
  await client.patch('/auth/password', data);
}
