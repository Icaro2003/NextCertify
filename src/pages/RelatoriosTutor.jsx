import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Modal, ListGroup, Spinner } from 'react-bootstrap';

import { FaBell, FaUserCircle, FaSignOutAlt, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import formAcompanhamentoService from '../services/formAcompanhamentoService';
import predefinicoesService from '../services/predefinicoesService';

function RelatoriosTutor() {
    const navigate = useNavigate();
    const [relatorios, setRelatorios] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState('concluido');
    const [showModal, setShowModal] = useState(false);
    const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

    const { usuario, token, handleLogout } = useAuthenticatedUser();
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {
        const carregarDados = async () => {
            if (!token || !usuario || !usuario.tutor) return;

            try {
                setCarregando(true);
                const [acompanhamentosData, vinculos, bolsistas] = await Promise.all([
                    formAcompanhamentoService.listByTutor(usuario.tutor.id, token),
                    predefinicoesService.listVinculos({ tutorId: usuario.tutor.id }, token),
                    predefinicoesService.listScholarshipHolders(token)
                ]);

                const concluidos = (acompanhamentosData.data || []).map(r => {
                    const cont = r.conteudo || {};
                    return {
                        id: r.id,
                        aluno: cont.nomeAluno || 'Aluno',
                        matricula: r.id, // Use ID for unique key
                        data: new Date(r.dataEnvio).toLocaleDateString(),
                        status: 'concluido',
                        detalhes: {
                            virtuais: cont.quantidadeVirtuais ?? cont.virtuais ?? 0,
                            presenciais: cont.quantidadePresenciais ?? cont.presenciais ?? 0,
                            dificuldadeTipo: cont.maiorDificuldadeAluno || 'Não informada',
                            descricao: cont.descricaoDificuldade || cont.descricao || ''
                        }
                    };
                });


                const pendentes = vinculos
                    .filter(v => !concluidos.some(c => c.aluno === bolsistas.find(b => b.id === v.bolsistaId || b.bolsista?.id === v.bolsistaId)?.nome))
                    .map(v => {
                        const b = bolsistas.find(b => b.id === v.bolsistaId || b.bolsista?.id === v.bolsistaId);
                        return {
                            id: v.id,
                            aluno: b?.nome || 'Aluno não encontrado',
                            matricula: b?.matricula || '',
                            data: "Aguardando",
                            status: 'pendente',
                            bolsistaId: v.bolsistaId,
                            periodoId: v.periodoId
                        };
                    });

                setRelatorios([...concluidos, ...pendentes]);
            } catch (error) {
                console.error("Erro ao carregar relatórios:", error);
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [token, usuario]);


    const handleVerDetalhes = (relatorio) => {
        setRelatorioSelecionado(relatorio);
        setShowModal(true);
    };


    const relatoriosFiltrados = relatorios.filter(r => {
        const statusAlvo = abaAtiva === 'concluido' ? 'concluido' : 'pendente';
        return r.status === statusAlvo;
    });

    const countConcluidos = relatorios.filter(r => r.status === 'concluido').length;
    const countPendentes = relatorios.filter(r => r.status === 'pendente').length;

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

            <Container className="my-5 flex-grow-1">
                <h2 className="fw-bold mb-4" style={{ color: '#0f52ba' }}>Meus Acompanhamentos</h2>

                <div className="d-flex gap-3 mb-5">
                    <Button
                        className="px-5 py-2 fw-bold shadow-sm"
                        style={{
                            backgroundColor: abaAtiva === 'concluido' ? '#1565c0' : '#fff',
                            color: abaAtiva === 'concluido' ? '#fff' : '#6c757d',
                            border: '1px solid #dee2e6', flex: 1, maxWidth: '300px'
                        }}
                        onClick={() => setAbaAtiva('concluido')}
                    >
                        Concluídos ({countConcluidos})
                    </Button>

                    <Button
                        className="px-5 py-2 fw-bold shadow-sm"
                        style={{
                            backgroundColor: abaAtiva === 'pendente' ? '#1565c0' : '#fff',
                            color: abaAtiva === 'pendente' ? '#fff' : '#6c757d',
                            border: '1px solid #dee2e6', flex: 1, maxWidth: '300px'
                        }}
                        onClick={() => setAbaAtiva('pendente')}
                    >
                        Pendentes ({countPendentes})
                    </Button>
                </div>

                <Row className="g-4">
                    {carregando ? (
                        <Col className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <div className="mt-2 text-muted small">Carregando acompanhamentos...</div>
                        </Col>
                    ) : relatoriosFiltrados.length > 0 ? (
                        relatoriosFiltrados.map((item) => (

                            <Col md={6} key={item.matricula}>
                                <Card className="border-0 shadow-sm rounded-4 p-2 h-100">
                                    <Card.Body className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            {item.status === 'concluido' ?
                                                <FaCheckCircle size={35} className="text-success" /> :
                                                <FaClock size={35} className="text-warning" />
                                            }
                                            <div>
                                                <span className="fw-bold d-block text-dark">{item.aluno}</span>
                                                <span className="text-muted small">Data: {item.data}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant={item.status === 'concluido' ? "outline-primary" : "primary"}
                                            className="fw-bold"
                                            onClick={() => item.status === 'pendente' ?
                                                navigate('/forms-tutor', {
                                                    state: {
                                                        alunoNome: item.aluno,
                                                        bolsistaId: item.bolsistaId,
                                                        periodoId: item.periodoId
                                                    }
                                                }) :
                                                handleVerDetalhes(item)}
                                        >
                                            {item.status === 'concluido' ? 'Detalhes' : 'Preencher'}
                                        </Button>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <p className="text-muted">Nenhum registro encontrado nesta aba.</p>
                        </Col>
                    )}
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-primary">
                        <FaFileAlt className="me-2" /> Detalhes do Acompamhamento
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="bg-light rounded-bottom p-4">
                    {relatorioSelecionado && (
                        <div>
                            <h5 className="fw-bold text-dark mb-4">{relatorioSelecionado.aluno}</h5>
                            <Row className="g-3">
                                <Col md={6}>
                                    <p className="mb-1 text-muted small fw-bold">STATUS</p>
                                    <span className="badge bg-success px-3 py-2">Concluído</span>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-1 text-muted small fw-bold">DATA DE ENTREGA</p>
                                    <p className="fw-medium">{relatorioSelecionado.data}</p>
                                </Col>

                                {relatorioSelecionado.detalhes ? (
                                    <>
                                        <Col md={6}>
                                            <p className="mb-1 text-muted small fw-bold">ENCONTROS VIRTUAIS</p>
                                            <p className="fw-medium">{relatorioSelecionado.detalhes.virtuais} encontro(s)</p>
                                        </Col>
                                        <Col md={6}>
                                            <p className="mb-1 text-muted small fw-bold">ENCONTROS PRESENCIAIS</p>
                                            <p className="fw-medium">{relatorioSelecionado.detalhes.presenciais} encontro(s)</p>
                                        </Col>

                                        <Col md={12}>
                                            <p className="mb-1 text-muted small fw-bold">TIPO DE DIFICULDADE</p>
                                            <p className="fw-medium text-capitalize">{relatorioSelecionado.detalhes.dificuldadeTipo}</p>
                                        </Col>
                                        <Col md={12}>
                                            <Card className="border-0 shadow-sm p-3 mt-2">
                                                <p className="mb-2 text-muted small fw-bold">DESCRIÇÃO/OBSERVAÇÕES</p>
                                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {relatorioSelecionado.detalhes.descricao || "Nenhuma observação registrada."}
                                                </p>
                                            </Card>
                                        </Col>
                                    </>
                                ) : (
                                    <Col md={12}>
                                        <p className="text-muted italic">Este é um registro histórico do sistema (Mock).</p>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="fw-bold">
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default RelatoriosTutor;