import React, { useState, useEffect, use } from "react";
import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Form, Badge, ButtonGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaSignOutAlt, FaCertificate, FaCheckCircle, FaTimesCircle, FaSearch, FaCalendarAlt, FaClock, FaListUl, FaExclamationTriangle, FaUndo } from 'react-icons/fa';
//import mockCertificados from '/src/mocks/certificados-mock.json';
import LogoNextCertify from '../img/NextCertify.png';

function ValidarCertificados() {
    const navigate = useNavigate();

    const [certificados, setCertificados] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("pendente");
    const [filtroCurso, setFiltroCurso] = useState("Sistemas de Informação");
    const [usuario, setUsuario] = useState({ name: "Carregando...." });
    const [buscaAluno, setBuscaAluno] = useState("");

    const [showModalNegar, setShowModalNegar] = useState(false);
    const [certSelecionado, setCertSelecionado] = useState(null);
    const [motivoNegativa, setMotivoNegativa] = useState("");

    //Opções padrões de motivo para negar os certificados enviados pelos alunos
    //Sujeito a alterações futuras 
    const motivosPadrao = [
        "Arquivo PDF ilegível ou corrompido",
        "Informações inconsistentes no certificado",
        "Certificado não corresponde ao evento informado",
        "Certificado fora da data que o aluno entrou na UFC"
    ];

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado) {
            setUsuario(usuarioLogado);
        } else {
            navigate("/");
        }

        //Os certificados serão inicializados com o status de observação vazia
        //POR FAVOR NÃO APAGAR ESSA PARTE DO CÓDIGO ATÉ AUTORIZAÇÃO FINAL
        const listaGlobal = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];

        if (listaGlobal.length === 0 && mockCertificados) {
            const iniciais = mockCertificados.map(c => ({ ...c, status: 'pendente', observacao: '' }));
            setCertificados(iniciais);
        } else {
            setCertificados(listaGlobal);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate("/");
    };


    const handleVerPDF = (cert) => {
        if (!cert.fileData) {
            alert("Arquivo não encontrado ou corrompido.");
            return;
        }

        try {
            // Se estiver em formato Base64 (Data URL), será aberto diretamente
            if (cert.fileData.startsWith('data:')) {
                const novaAba = window.open();
                novaAba.document.write(
                    `<iframe src="${cert.fileData}" frameborder="0" style="border:0; top:0px left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                );
            } else {
                alert("Formato de arquivo inválido.");
            }
        } catch (error) {
            console.error("Erro ao abrir PDF:", error);
            alert("Não foi possível abrir o visualizador de PDF.");
        }
    };

    const salvarCertificados = (listaAtualizado) => {
        localStorage.setItem("lista_global_certificados", JSON.stringify(listaAtualizado));
    };

    const handleAprovar = (id) => {
        const novaLista = certificados.map(c => c.id === id ? { ...c, status: 'aprovado', observacao: '' } : c);
        setCertificados(novaLista);
        salvarCertificados(novaLista);
    };

    const abrirModalNegar = (cert) => {
        setCertSelecionado(cert);
        setShowModalNegar(true);
    };

    const confirmarNegativa = () => {
        if (!motivoNegativa.trim()) {
            alert("Por favor, descreva ou selecione o motivo da rejeição");
            return;
        }
        const novaLista = certificados.map(c => c.id === certSelecionado.id ? { ...c, status: 'negado', motivo: motivoNegativa, observacao: motivoNegativa } : c );
        setCertificados(novaLista);
        salvarCertificados(novaLista);
        fecharModal();
    };

    const fecharModal = () => {
        setShowModalNegar(false);
        setMotivoNegativa("");
        setCertSelecionado(null);
    };

    const handleReverter = (id) => {
        setCertificados(prev => prev.map(c => c.id === id ? { ...c, status: 'pendente', observacao: '' } : c));
    };

    const gradientStyle = { background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white' };
    const certificadosFiltrados = certificados.filter(c => c.status === abaAtiva);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-0">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#"><Image src={LogoNextCertify} alt="Logo" height="40" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link href="#" className="mx-2 text-dark">Alunos</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Tutores</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Predefinições</Nav.Link>

                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={gradientStyle} className="py-5 mb-4 shadow-sm">
                <Container>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <div className="bg-white p-2 rounded-circle shadow-sm">
                                <FaUserCircle size={60} className="text-primary" />
                            </div>
                        </Col>
                        <Col>
                            <h3 className="mb-0 fw-bold">{usuario.name}</h3>
                            <Badge bg="light" text="dark" className="text-uppercase px-3 py-2 mt-1 shadow-sm">
                                {usuario.role || 'Bolsista'}
                            </Badge>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="flex-grow-1">
                <div className="d-flex justify-content-center mb-4">
                    <ButtonGroup className="bg-white shadow-sm p-1 rounded-pill">
                        <Button variant={abaAtiva === 'pendente' ? 'primary' : 'white'} className="rounded-pill px-4 fw-bold" onClick={() => setAbaAtiva('pendente')}><FaListUl className="me-2" />Pendentes</Button>
                        <Button variant={abaAtiva === 'aprovado' ? 'primary' : 'white'} className="rounded-pill px-4 fw-bold" onClick={() => setAbaAtiva('aprovado')}><FaCheckCircle className="me-2" />Aprovados</Button>
                        <Button variant={abaAtiva === 'negado' ? 'primary' : 'white'} className="rounded-pill px-4 fw-bold" onClick={() => setAbaAtiva('negado')}><FaTimesCircle className="me-2" />Negados</Button>
                    </ButtonGroup>
                </div>

                <Card className="border-0 shadow-sm p-4 mb-4 text-start">
                    <Row className="align-items-end g-3">
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-dark small text-uppercase">Curso</Form.Label>
                                <Form.Select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
                                    <option>Sistemas de Informação</option>
                                    <option>Engenharia de Software</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-dark small text-uppercase">Aluno</Form.Label>
                                <Form.Control placeholder="Nome do aluno..." value={buscaAluno} onChange={(e) => setBuscaAluno(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button variant="primary" className="w-100 fw-bold py-2 shadow-sm"><FaSearch className="me-2" /> Filtrar</Button>
                        </Col>
                    </Row>
                </Card>

                <h4 className="text-primary fw-bold mb-4 px-2">{abaAtiva === 'pendente' ? 'Certificados para Validação' : abaAtiva === 'aprovado' ? 'Certificados Aprovados' : 'Certificados Negados'}</h4>

                <Row className="g-4 mb-5 text-start">
                    {certificadosFiltrados.length > 0 ? (
                        certificadosFiltrados.map(cert => (
                            <Col key={cert.id} xs={12}>
                                <Card className={`border-0 shadow-sm border-start border-4 ${abaAtiva === 'aprovado' ? 'border-success' : abaAtiva === 'negado' ? 'border-danger' : 'border-primary'}`}>
                                    <Card.Body className="p-4">
                                        <Row className="align-items-center">
                                            <Col md={7}>
                                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                                    <h5 className="fw-bold text-dark mb-1">{cert.titulo}</h5>
                                                    <Badge bg="info" className="px-2 py-1 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px'}}>
                                                        {cert.categoria || 'Geral'}
                                                    </Badge>
                                                </div>
                                                <div className="text-muted fw-bold small mb-1">
                                                    Aluno: <span className="text-dark">{cert.alunoNome || "Não informado"}</span>
                                                </div>
                                                {/*função para on=bservação da negação do certificado*/}
                                                {cert.status === 'negado' && cert.observacao && (
                                                    <div className="bg-light p-3 rounded mb-3 border-start border-danger border-3 shadow-sm">
                                                        <small className="text-danger fw-bold d-block mb-1"><FaExclamationTriangle className="me-1" />Motivo da Rejeição:</small>
                                                        <span className="text-dark italic">{cert.observacao}</span>
                                                    </div>
                                                )}
                                                <div className="d-flex gap-4 mt-2">
                                                    <span className="small text-muted fw-bold"><FaCalendarAlt className="me-1 text-primary" /> {cert.periodo}</span>
                                                    <span className="small text-muted fw-bold"><FaClock className="me-1 text-primary" /> {cert.horas}</span>
                                                </div>
                                            </Col>

                                            <Col md={5} className="d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
                                                <Button variant="outline-primary" className="fw-bold d-flex align-items-center gap-2" onClick={() => handleVerPDF(cert)}><FaCertificate style={{ color: '#FFD43B' }} /> Ver PDF</Button>

                                                {abaAtiva === 'pendente' ? (
                                                    <>
                                                        <Button variant="success" className="fw-bold" onClick={() => handleAprovar(cert.id)}><FaCheckCircle className="me-1" /> Aprovar</Button>
                                                        <Button variant="danger" className="fw-bold" onClick={() => abrirModalNegar(cert)}><FaTimesCircle className="me-1" /> Negar</Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline-secondary" size="sm" onClick={() => handleReverter(cert.id)}><FaUndo className="me-1" /> Reverter para Pendente</Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12} className="text-center py-5">
                            <p className="text-muted fs-5">Nenhum certificado encontrado nesta categoria.</p>
                        </Col>
                    )}
                </Row>
            </Container>

            <Modal show={showModalNegar} onHide={fecharModal} centered size="lg">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title className="fw-bold"><FaExclamationTriangle className="me-2" /> Justificar Reprovação</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="mb-3 text-muted">O certificado <strong>{certSelecionado?.titulo}</strong> será enviado para o histórico do aluno como <strong>Negado</strong>
                        Por favor, selecione ou descreva o motivo:</p>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Motivos Comuns:</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {motivosPadrao.map((motivo, index) => (
                                <Button key={index} variant="outline-secondary" size="sm" className="rounded-pill" onClick={() => setMotivoNegativa(motivo)}>{motivo}</Button>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fw-bold text-danger">Descrição Detalhada:</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Escreva aqui o motivo detalhado para orientar o aluno..." value={motivoNegativa} onChange={(e) => setMotivoNegativa(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" className="fw-bold" onClick={fecharModal}>Cancelar</Button>
                    <Button variant="danger" className="fw-bold px-4 shadow-sm" onClick={confirmarNegativa}>Confirmar Reprovação</Button>
                </Modal.Footer>
            </Modal>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default ValidarCertificados;