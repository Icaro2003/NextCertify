import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RedefinirSenha from './pages/RedefinirSenha';
import VerificarCodigo from './pages/VerificarCodigo';
import Contato from './pages/Contato';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/verificar-codigo" element={<VerificarCodigo />} />
      <Route path="/contato" element={<Contato />} />
    </Routes>
  );
}

export default App;