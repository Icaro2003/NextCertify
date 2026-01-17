import { Container, Row, Col, Card, Button, Navbar, Nav, Badge, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserGraduate, FaUserCircle, FaSignOutAlt, FaPen, FaChalkboardTeacher, FaFileAlt, FaCertificate, FaFile } from 'react-icons/fa';
import { FaUserGear, FaBell } from 'react-icons/fa6';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';

function HomeCoordenador() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("usuarioLogado");
        const userParsed = savedUser ? JSON.parse(savedUser) : null;

        if (!userParsed) {
            navigate('/');
        } else if (userParsed.role !== 'coordenador') {
            alert("Acesso restrito: Você não tem permissão de coordenador.");

            if (userParsed.role === 'tutor') navigate('/home-tutor');
            else if (userParsed.role === 'bolsista') navigate('/bolsista');
            else if (userParsed.role === 'aluno') navigate('/aluno');
            else navigate('/');
        }
    }, [navigate]);

    if (!usuario || usuario.role !== 'coordenador') {
        return <div className="p-5 text-center">Verificando permissões...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <Image
                            src={LogoNextCertify}
                            alt="Logo NextCertify"
                            height="40"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link href="#" className="mx-2 text-dark">Alunos</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Tutores</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Predefinições</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div style={{ ...gradientStyle, padding: '60px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={8} className="d-flex align-items-center gap-4">
                            <div className="bg-white rounded-circle d-flex justify-content-center align-items-center text-primary"
                                style={{ width: '100px', height: '100px' }}>
                                <FaUserCircle size={80} />
                            </div>
                            <div>
                                <h2 className="mb-1 fw-bold">{usuario.name}</h2>
                                <Badge bg="light" text="primary" className="mb-2 px-3 py-1">{usuario.role}</Badge>
                                <p className="mb-0 text-light">Matrícula: {usuario.matricula}</p>
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
                <div className="mb-5">
                    <h1 className="text-primary fw-bold">Seja bem-vindo {usuario.name.split(' ')[0]}</h1>
                    <p className="text-muted fs-5">
                        Aqui você pode realizar upload dos seus certificados e fazer a avaliação do projeto de tutoria.
                    </p>
                </div>

                <Row className="g-4">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaUserGraduate size={60} className="text-info mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Registro de alunos</h3>
                                <p className="text-muted mb-4">
                                    Verificar alunos cadastrados na tutoria.
                                </p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/registro-aluno')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaChalkboardTeacher size={60} className="text-warning mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Registro de tutores</h3>
                                <p className="text-muted mb-4">
                                    Verificar tutores cadastrados
                                </p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/registro-tutores')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaUserGear size={60} className="text-secondary mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Predefinições</h3>
                                <p className="text-muted mb-4">
                                    Definir predefinições que o aluno tem que cumprir na tutoria.
                                </p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/predefinicoes')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/*Relatório de Gestão Geral*/}
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={60} className="text-secondary mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Relatório de Gestão Geral</h3>
                                <p className="text-muted mb-4">
                                    Gerar relatório de gestão geral da Tutoria Acadêmica
                                </p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/relatorios-coordenador')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={60} className="text-secondary mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Relatório de Individual do Tutor</h3>
                                <p className="text-muted mb-4">
                                    Gerar relatório individual do tutor da Tutoria Acadêmica
                                </p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/relatorio-individual-tutor')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={60} className="text-secondary mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Relatório individual Acompanhamento dos alunos</h3>
                                <p className="text-muted mb-4">Relatório individual de acompanhamento dos alunos</p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/relatorio-individual-aluno')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaCertificate size={60} className="mb-3" style={{ color: "#FFD43B" }} />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Validação dos Certificados</h3>
                                <p className="text-muted mb-4">Validação dos certificados enviados pelos alunos da tutoria.</p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/validar-certificados')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={60} className="text-secondary mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Relatório Acompanhamento Geral dos alunos</h3>
                                <p className="text-muted mb-4">Relatório de acompanhamento geral dos alunos</p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/relatorio-geral-aluno')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaFileAlt size={60} className="mb-3" style={{ color: "#e10d0d" }} />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Relatório de Acompanhamento geral do tutor</h3>
                                <p className="text-muted mb-4">Relatório Acompanhamento geral do tutor</p>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100"
                                    onClick={() => navigate('/relatorio-geral-tutor')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default HomeCoordenador;