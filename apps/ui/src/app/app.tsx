import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AteneoPag from '../pages/AteneoPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ateneo" element={<AteneoPag />} />
    </Routes>
  );
}

export default App;
