import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

// Importando todas as páginas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RedefinirSenha from './pages/RedefinirSenha';
import VerificarCodigo from './pages/VerificarCodigo';
import Contato from './pages/Contato';

// Telas do Aluno
import HomeAluno from './pages/HomeAluno';
import MeusCertificados from './pages/MeusCertificados';
import AvaliacaoTutoria from './pages/AvaliacaoTutoria';
import Teste from './pages/teste';
import EditarPerfil from './pages/EditarPerfil';
import HomeBolsista from './pages/HomeBolsista';
import RegistroAluno from './pages/RegistroAluno';

// Telas do Coordenador
import HomeCoordenador from './pages/HomeCoordenador';
import RelatoriosCoordenador from './pages/RelatoriosCoordenador';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/verificar-codigo" element={<VerificarCodigo />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/teste" element={<Teste />} />

      <Route path="/aluno" element={<HomeAluno />} />
      <Route path="/bolsista" element={<HomeBolsista />} />
      <Route path="/registro-aluno" element={<RegistroAluno />} />
      <Route path="/meus-certificados" element={<MeusCertificados />} />
      <Route path="/avaliacao-tutoria" element={<AvaliacaoTutoria />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />

      <Route path="/coordenador" element={<HomeCoordenador />} />
      <Route path="/relatorios-coordenador" element={<RelatoriosCoordenador />} />
    </Routes>
  );
}

export default App;