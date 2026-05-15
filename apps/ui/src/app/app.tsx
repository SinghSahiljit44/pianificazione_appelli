import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import SessioniPage from '../pages/admin/SessioniPage';
import DocentiPage from '../pages/admin/DocentiPage';
import MateriePage from '../pages/admin/MateriePage';
import CorsiLaureaPage from '../pages/admin/CorsiLaureaPage';
import DocenteLayout from '../pages/docente/DocenteLayout';
import AppelliPage from '../pages/docente/AppelliPage';
import SessioniDocentePage from '../pages/docente/SessioniDocentePage';

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
