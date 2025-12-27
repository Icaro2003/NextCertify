import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import mockData from '../mock/relatorio-mock.json';


function RelatoriosCoordenador() {
    const navigate = useNavigate();
    
    // Estados inicializados como vazios
    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { name: "" },
        metricas: [],
        graficos: [],
        horasCertificado: [],
        dificuldadesGrafico: [],
        tutores: [],
        tutorandos: [],
        dificuldades: []
    });

useEffect(() => {
    setDadosDashboard({
        ...mockData,
        usuario: { name: "Coordenador Geral" }
    });
}, []);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate('/');
    };

    const gradientStyle = { background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white' };
    const cardHeaderStyle = { fontSize: '0.85rem', color: '#0056b3', fontWeight: 'bold' };
    const valueStyle = { fontSize: '1.2rem', fontWeight: '500', color: '#555' };

    return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#"><Image src={LogoNextCertify} alt="Logo" height="40" /></Navbar.Brand>
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
                                <span className="fw-bold text-dark">{dadosDashboard.usuario.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="flex-grow-1">
                <h2 className="text-primary fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Relatório de Gestão Geral</h2>

                {/* Métricas Superiores */}
                <Row className="g-3 mb-4">
                    {dadosDashboard.metricas.length > 0 ? (
                        dadosDashboard.metricas.map((item, idx) => (
                            <Col key={idx} md>
                                <Card className="border-0 shadow-sm h-100">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={cardHeaderStyle}>{item.label}</div>
                                            <div style={valueStyle}>{item.val}</div>
                                        </div>
                                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col><p className="text-muted">Nenhuma métrica encontrada no sistema.</p></Col>
                    )}
                </Row>

                {/* Gráficos */}
                <Row className="mb-4 g-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Encontros Realizados</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dadosDashboard.graficos}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="online" stroke="#00c6fb" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="presencial" stroke="#005bea" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Experiência da Tutoria</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dadosDashboard.graficos}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="boa" stroke="#28a745" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="ruim" stroke="#dc3545" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    <Col md={6}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <h6 className="fw-bold text-dark">Horas por Certificados</h6>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={dadosDashboard.horasCertificado}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis datakey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="estudos" stroke="#2563eb" strokeWidth={3} />
                                <Line type="monotone" dataKey="eventos" stroke="#06b6d4" strokeWidth={3} />
                                <Line type="monotone" dataKey="monitoria" stroke="#6366f1" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

                {/* Tabela e Lista de Dificuldades */}
                <Row className="mb-5 g-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 mb-4">
                            <h6 className="fw-bold mb-3">Tutorandos</h6>
                            <Table hover responsive borderless size="sm" className="text-muted">
                                <thead className="border-bottom">
                                    <tr><th>Matrícula</th><th>Nome</th><th>Encontros</th><th>Semestre</th></tr>
                                </thead>
                                <tbody>
                                    {dadosDashboard.tutorandos.map((tuto, i) => (
                                        <tr key={i}>
                                            <td>{tuto.id}</td>
                                            <td>{tuto.nome}</td>
                                            <td>{tuto.encontros}</td>
                                            <td>{tuto.semestre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 mb-4">
                            <h6 className="fw-bold mb-3">Tutores</h6>
                            <Table hover responsive borderless size="sm" className="text-muted">
                                <thead className="border-bottom">
                                    <tr><th>Matrícula</th><th>Nome</th><th>Encontros</th><th>Semestre</th></tr>
                                </thead>
                                <tbody>
                                    {dadosDashboard.tutores.map((tutores, e) => (
                                        <tr key={e}>
                                            <td>{tutores.id}</td>
                                            <td>{tutores.nome}</td>
                                            <td>{tutores.encontros}</td>
                                            <td>{tutores.semestre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                
                <Col md={6}>
                    <Card className="border-0 shadow-sm p-3 h-100">
                        <h6 className="fw-bold text-dark">Apresentou Dificuldades</h6>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={dadosDashboard.dificuldadesGrafico}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sim" fill="#2563eb" radius={[4, 4, 0, 0]}/>
                                <Bar dataKey="nao" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="border-0 shadow-sm p-3">
                        <h6 className="fw-bold mb-3">Maiores dificuldades dos tutorandos</h6>
                        <ListGroup variant="flush">
                            {dadosDashboard.dificuldades.map((dif, i) => (
                                <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center border-0 px-0 mb-2">
                                    <div>{dif.icon} <strong>{dif.titulo}</strong><br /><small className="text-muted">{dif.desc}</small></div>
                                    <span className="fw-bold text-primary">{dif.perc}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                </Row>

            <div className="d-flex gap-3 mb-5">
                <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#1a56db' }}>
                    <FaFilePdf /> Baixar PDF
                </Button>
                <Button variant="info" className="px-5 py-2 fw-bold text-white d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#06b6d4' }}>
                    <FaFileCsv /> Baixar CSV
                </Button>
            </div>
        </Container><footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container><h5 className="mb-0">© 2025 - NextCertify</h5></Container>
            </footer>
         </div>  
    );
}

export default RelatoriosCoordenador;