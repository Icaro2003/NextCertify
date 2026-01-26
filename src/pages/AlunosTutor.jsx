import { Container, Row, Col, Button, Navbar, Nav, Badge, Image, Table, Spinner } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaPen, FaFileAlt, FaEye } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import predefinicoesService from '../services/predefinicoesService';
import formAcompanhamentoService from '../services/formAcompanhamentoService';


function AlunosTutor() {
    const navigate = useNavigate();
    const location = useLocation();

    const [listaAlunos, setListaAlunos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const { usuario, token, userRole, handleLogout } = useAuthenticatedUser();

    useEffect(() => {
        const carregarDados = async () => {
            if (!token || !usuario || !usuario.tutor) return;

            try {
                setCarregando(true);

                const [vinculos, bolsistas, acompanhamentosData] = await Promise.all([
                    predefinicoesService.listVinculos({ tutorId: usuario.tutor.id }, token),
                    predefinicoesService.listScholarshipHolders(token),
                    formAcompanhamentoService.listByTutor(usuario.tutor.id, token)
                ]);

                const acompanhamentos = acompanhamentosData.data || [];

                const meusAlunos = vinculos.map(v => {
                    const bolsista = bolsistas.find(b => b.id === v.bolsistaId || (b.bolsista && b.bolsista.id === v.bolsistaId));

                    const acompanhamentosDoAluno = acompanhamentos
                        .filter(a => a.bolsistaId === v.bolsistaId)
                        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));

                    const ultimaData = acompanhamentosDoAluno.length > 0
                        ? new Date(acompanhamentosDoAluno[0].dataEnvio).toLocaleDateString()
                        : "Sem preenchimento";

                    return {
                        id: v.bolsistaId,
                        vinculoId: v.id,
                        periodoId: v.periodoId,
                        nome: bolsista?.nome || 'Aluno não encontrado',
                        email: bolsista?.email || '',
                        matricula: bolsista?.matricula || '---',
                        ultimaData: ultimaData
                    };
                });


                setListaAlunos(meusAlunos);
            } catch (error) {
                console.error("Erro ao carregar alunos do tutor:", error);
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [token, usuario]);


    const gradientStyle = {
        background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    if (!usuario || usuario.role !== 'tutor') {
        return <div className="p-5 text-center">Verificando permissões...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link onClick={() => navigate('/home-tutor')} className="mx-2 text-dark fw-bold" style={{ cursor: 'pointer' }}>Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/alunos-tutor')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorios-tutor')} className="mx-2 text-dark">Relatórios</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.nome}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={handleLogout}>
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={{ ...gradientStyle, padding: '40px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={8} className="d-flex align-items-center gap-4">
                            <div className="bg-white rounded-circle d-flex justify-content-center align-items-center text-primary"
                                style={{ width: '80px', height: '80px' }}>
                                <FaUserCircle size={60} />
                            </div>
                            <div>
                                <h2 className="mb-1 fw-bold fs-3">{usuario.nome}</h2>
                                <Badge bg="light" text="primary" className="mb-2 px-3 py-1">{userRole(usuario.role)}</Badge>
                                <p className="mb-0 text-light mt-1 opacity-75 small">
                                    Tutor responsável pelo acompanhamento acadêmico.
                                </p>
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <Button variant="outline-light" className="px-4 py-2 d-inline-flex align-items-center gap-2" onClick={() => navigate('/editar-perfil')}>
                                Editar Perfil <FaPen size={12} />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="my-5 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold mb-0">Meus Alunos Tutorados</h2>
                </div>

                <div className="bg-white p-4 rounded-4 shadow-sm">
                    <Table responsive hover className="align-middle mb-0">
                        <thead>
                            <tr style={{ borderBottom: '2px solid #0f52ba' }}>
                                <th className="py-3 text-primary">Aluno(a)</th>
                                {/* <th className="py-3 text-primary">Matrícula</th> */}
                                <th className="py-3 text-primary">Último Preenchimento</th>
                                <th className="py-3 text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carregando ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <div className="mt-2 text-muted small">Carregando alunos vinculados...</div>
                                    </td>
                                </tr>
                            ) : listaAlunos.length > 0 ? (
                                listaAlunos.map((aluno) => (

                                    <tr key={aluno.id}>
                                        <td className="py-3">
                                            <div className="fw-bold text-dark">{aluno.nome}</div>
                                            <div className="small text-muted">{aluno.email}</div>
                                        </td>
                                        {/* <td className="text-muted">{aluno.matricula}</td> */}
                                        <td>
                                            <Badge bg={aluno.ultimaData === "Sem preenchimento" ? "secondary" : "info"} className="fw-normal">
                                                {aluno.ultimaData}
                                            </Badge>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => navigate('/forms-tutor', {
                                                        state: {
                                                            alunoNome: aluno.nome,
                                                            matricula: aluno.matricula,
                                                            bolsistaId: aluno.id,
                                                            periodoId: aluno.periodoId
                                                        }
                                                    })}
                                                >

                                                    <FaFileAlt className="me-1" /> Novo Form
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    style={{ backgroundColor: '#0f52ba' }}
                                                    onClick={() => navigate('/relatorios-tutor', { state: { alunoId: aluno.id, nome: aluno.nome } })}
                                                >
                                                    <FaEye className="me-1" /> Ver Histórico
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        Nenhum aluno vinculado à sua matrícula foi encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default AlunosTutor;