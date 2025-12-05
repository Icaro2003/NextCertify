import { Container, Row, Col, Card, Button, Navbar, Nav, Form, Badge, Image } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaCloudUploadAlt, FaCalendarAlt, FaClock, FaDownload, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import LogoNextCertify from '../img/NextCertify.png';

function MeusCertificados() {
    const navigate = useNavigate();

    const certificados = [
        {
            id: 1,
            titulo: 'Monitoria 2025.1 - Sistemas Operacionais',
            status: 'Aprovado',
            periodo: '31/03 à 31/07/2025',
            horas: '10 horas'
        },
        {
            id: 2,
            titulo: 'Monitoria 2025.1 - Sistemas Operacionais',
            status: 'Negado',
            periodo: '31/03 à 31/07/2025',
            horas: '10 horas'
        },
        {
            id: 3,
            titulo: 'Monitoria 2025.1 - Sistemas Operacionais',
            status: 'Em espera',
            periodo: '31/03 à 31/07/2025',
            horas: '10 horas'
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Aprovado': return 'text-success';
            case 'Negado': return 'text-danger';
            case 'Em espera': return 'text-warning';
            default: return 'text-secondary';
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" onClick={() => navigate('/aluno')} style={{ cursor: 'pointer' }}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="mx-auto fw-medium">
                            <Nav.Link href="#" className="mx-2 text-dark fw-bold">Certificados</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">João da Silva</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">

                <div className="mb-4">
                    <h1 className="text-primary fw-bold mb-3">Meus Certificados</h1>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-3 py-2 fw-medium">
                        <FaCloudUploadAlt size={20} />
                        Fazer upload do certificado
                    </Button>
                </div>

                <div className="mb-5">
                    <label className="fw-bold text-primary mb-1 ms-1">Título</label>
                    <div className="d-flex gap-2">
                        <Form.Control type="text" placeholder="Digite o título do Certificado" />
                        <Button variant="primary" style={{ minWidth: '100px' }}>Salvar</Button>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3">
                    {certificados.map((cert) => (
                        <Card key={cert.id} className="border border-secondary-subtle rounded-4 shadow-sm">
                            <Card.Body className="p-4">
                                <Row className="align-items-center">
                                    <Col lg={8}>
                                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                            <h5 className="text-primary fw-bold mb-0">{cert.titulo}</h5>
                                            <span className={`fw-bold ${getStatusColor(cert.status)}`}>
                                                {cert.status}
                                            </span>
                                        </div>
                                        <div className="d-flex gap-4 text-muted">
                                            <div className="d-flex align-items-center gap-2">
                                                <FaCalendarAlt /> {cert.periodo}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaClock /> {cert.horas}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                                        <div className="d-flex justify-content-lg-end gap-2">
                                            <Button variant="primary" className="px-3">
                                                Baixar Certificado
                                            </Button>
                                            <Button variant="danger" className="px-4">
                                                Remover
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
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

export default MeusCertificados;