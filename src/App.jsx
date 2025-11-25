import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'; // <--- Importe as rotas

import Login from './pages/FormLogin'; 
import AlunoDashboard from './pages/AlunoDashBoard';

function App() {
  return (
    <Routes>
      {/* Caminho "/" (Raiz) -> Mostra Login */}
      <Route path="/" element={<Login />} />

      {/* Caminho "/aluno" -> Mostra Dashboard */}
      <Route path="/aluno" element={<AlunoDashboard />} />
    </Routes>
  );
}

export default App;