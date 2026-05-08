import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AteneoPage from '../pages/AteneoPage';
import LoginPage from '../pages/LoginPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ateneo" element={<AteneoPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
