import { Container, Row, Col, Card, Button, Navbar, Nav, Badge, Image } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaCertificate, FaClipboardCheck, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';

function HomeAluno() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        //Não apagar por enquanto para realizar os testes
        // Pegar os dados salvos no LocalStorage
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if(usuarioLogado) {
            setUsuario(usuarioLogado);
        } else {
            // Vai retornar para login caso não tenha usuário logado
            navigate('/');
        }
    }, [navigate]);

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    if(!usuario){
        return <div>Carregando...</div>;
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
                        <Nav className="mx-auto fw-medium">
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
                            <Button variant="outline-light" className="px-4 py-2 d-inline-flex align-items-center gap-2">
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
                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaCertificate size={60} className="text-warning mb-3" /> 
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Upload de certificados</h3>
                                <p className="text-muted mb-4">
                                    Realizar o upload de certificados emitidos pelo Sistema de Eventos da UFC
                                </p>
                                <Button 
                                    variant="primary" 
                                    className="px-4 py-2 w-100" 
                                    onClick={() => navigate('/meus-certificados')}
                                >
                                    Veja mais
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                            <Card.Body>
                                <div className="mb-3">
                                    <FaClipboardCheck size={60} className="text-success mb-3" />
                                </div>
                                <h3 className="text-primary fw-bold mb-3">Avaliação de tutoria</h3>
                                <p className="text-muted mb-4">
                                    Fazer avaliação mensal da tutoria acadêmica.
                                </p>
                                <Button 
                                    variant="primary" 
                                    className="px-4 py-2 w-100" 
                                    onClick={() => navigate('/avaliacao-tutoria')}
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

export default HomeAluno;