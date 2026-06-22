import type { AuthenticatedUser } from '../features/auth/auth.api';

const TOKEN_KEY = 'token';
const USER_KEY = 'auth_user';

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthenticatedUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  save(token: string, user: AuthenticatedUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  isAdmin(): boolean {
    return this.getUser()?.role === 'ADMIN';
  },
};
