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

// Telas do bolsista
import HomeBolsista from './pages/HomeBolsista';
import RegistroAluno from './pages/RegistroAluno';
import RegistroTutores from './pages/RegistroTutores';
import ValidarCertificados from './pages/ValidarCertificados';
import RelatorioIndividualTutor from './pages/RelatorioIndividualTutor';
import RelatorioGeralTutor from './pages/RelatorioGeralTutor';
import RelatorioIndividualAluno from './pages/RelatorioIndividualAluno';
import RelatorioGeralAluno from './pages/RelatorioGeralAluno';
import Predefinicoes from './pages/Predefinicoes';

import HomeTutor from './pages/HomeTutor';
import AlunosTutor from './pages/AlunosTutor';
import FormsTutor from './pages/FormsTutor';
import RelatoriosTutor from './pages/RelatoriosTutor';
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
      <Route path="/teste" element={<h1>FUNCIONOU</h1>} />

      <Route path="/aluno" element={<HomeAluno />} />
      
      <Route path="/meus-certificados" element={<MeusCertificados />} />
      <Route path="/avaliacao-tutoria" element={<AvaliacaoTutoria />} />
      <Route path="/editar-perfil" element={<EditarPerfil />} />

      <Route path="/bolsista" element={<HomeBolsista />} />
      <Route path="/registro-aluno" element={<RegistroAluno />} />
      <Route path="/registro-tutores" element={<RegistroTutores />} />
      <Route path="/relatorio-individual-tutor" element={<RelatorioIndividualTutor />} />
      <Route path="/relatorio-geral-tutor" element={<RelatorioGeralTutor />} />
      <Route path="/relatorio-individual-aluno" element={<RelatorioIndividualAluno />} />
      <Route path="/relatorio-geral-aluno" element={<RelatorioGeralAluno />} />
      <Route path="/validar-certificados" element={<ValidarCertificados />} />
      <Route path="/predefinicoes" element={<Predefinicoes />} />

      <Route path="/home-tutor" element={<HomeTutor />} />
      <Route path="/alunos-tutor" element={<AlunosTutor />} />
      <Route path="/forms-tutor" element={<FormsTutor />} />
      <Route path="/relatorios-tutor" element={<RelatoriosTutor />} />

      <Route path="/coordenador" element={<HomeCoordenador />} />
      <Route path="/relatorios-coordenador" element={<RelatoriosCoordenador />} />
    </Routes>
  );
}

export default App;