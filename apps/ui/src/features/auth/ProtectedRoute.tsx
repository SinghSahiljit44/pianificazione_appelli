import { Navigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: Props) {
  if (!authStore.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (!requireAdmin && authStore.isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  if (requireAdmin && !authStore.isAdmin()) {
    return <Navigate to="/docente" replace />;
  }
  return <>{children}</>;
}
