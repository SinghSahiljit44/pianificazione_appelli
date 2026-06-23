import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import AdminLayout from '../features/layouts/AdminLayout';
import SessioniPage from '../features/sessioni/SessioniPage';
import DocentiPage from '../features/docenti/DocentiPage';
import MateriePage from '../features/materie/MateriePage';
import CorsiLaureaPage from '../features/corsi-laurea/CorsiLaureaPage';
import DocenteLayout from '../features/layouts/DocenteLayout';
import AppelliPage from '../features/appelli/AppelliPage';
import AppelliAdminPage from '../features/appelli/AppelliAdminPage';
import SessioniDocentePage from '../features/sessioni/SessioniDocentePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/sessioni" replace />} />
        <Route path="sessioni" element={<SessioniPage />} />
        <Route path="docenti" element={<DocentiPage />} />
        <Route path="materie" element={<MateriePage />} />
        <Route path="corsi-laurea" element={<CorsiLaureaPage />} />
        <Route path="appelli" element={<AppelliAdminPage />} />
      </Route>

      <Route
        path="/docente"
        element={
          <ProtectedRoute>
            <DocenteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/docente/appelli" replace />} />
        <Route path="appelli" element={<AppelliPage />} />
        <Route path="sessioni" element={<SessioniDocentePage />} />
      </Route>
    </Routes>
  );
}

export default App;
