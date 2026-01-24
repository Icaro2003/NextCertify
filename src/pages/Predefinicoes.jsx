import { Container, Row, Col, Button, Navbar, Nav, Form, Image, Card } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import mockAut from '../mocks/auth-mock.json';


function Predefinicoes() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [horasCategoria, setHorasCategoria] = useState({});
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [tutorSelecionado, setTutorSelecionado] = useState("");
    const [alunoSelecionado, setAlunoSelecionado] = useState("");
    const [tutores, setTutores] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [vinculos, setVinculos] = useState([]);

    useEffect(() => {
        const usuariosLS = JSON.parse(localStorage.getItem("usuarios") || "[]");
        const listaMock = Array.isArray(mockAut) ? mockAut : (mockAut.users || []);
        const todosUsuarios = [...listaMock, ...usuariosLS];

        setTutores(todosUsuarios.filter(u => u.role === 'tutor'));
        setAlunos(todosUsuarios.filter(u => u.role === 'aluno'));

        const horasSalvas = JSON.parse(localStorage.getItem("predefinicoes_horas") || "{}");
        setHorasCategoria(horasSalvas);
        const vinculosSalvos = JSON.parse(localStorage.getItem("vinculos_tutoria") || "[]");
        setVinculos(vinculosSalvos);
    }, []);

    const handleSalvarHoras = (e) => {
        e.preventDefault();
        localStorage.setItem("predefinicoes_horas", JSON.stringify(horasCategoria));
        alert("Configuração de horas salva!");
    };

    const handleAtribuirTutoria = (e) => {
        e.preventDefault();
        if (!tutorSelecionado || !alunoSelecionado) return;

        const novoVinculo = {
            id: Date.now(),
            tutorNome: tutorSelecionado,
            alunoNome: alunoSelecionado,
            dataInicio,
            dataFim
        };

        const novosVinculos = [...vinculos, novoVinculo];
        setVinculos(novosVinculos);
        localStorage.setItem("vinculos_tutoria", JSON.stringify(novosVinculos));
        alert("Vínculo criado com sucesso!");
    };

    const removerVinculo = (id) => {
        const filtrados = vinculos.filter(v => v.id !== id);
        setVinculos(filtrados);
        localStorage.setItem("vinculos_tutoria", JSON.stringify(filtrados));
    };

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    if (!usuario) return <div className='p-5 text-center'>Carregando....</div>;


    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand={false} expanded={expanded} onToggle={setExpanded} className="shadow-sm py-3">
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
                        <Nav className="text-center mx-auto fw-medium mb-2">
                            <Nav.Link onClick={() => navigate('/bolsista')} className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-aluno')} className="mx-2 text-dark">Registro Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-tutores')} className="mx-2 text-dark">Registro Tutores</Nav.Link>
                            <Nav.Link onClick={() => navigate('/predefinicoes')} className="mx-2' text-dark fw-bold">Predefinições</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-tutor')} className="mx-2 text-dark">Relatório Tutor</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-aluno')} className="mx-2 text-dark">Relatório Aluno</Nav.Link>
                            <Nav.Link onClick={() => navigate('/validar-certificados')} className="mx-2 text-dark">Validar Certificados</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-geral-aluno')} className="mx-2 text-dark">Relatório Geral Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-geral-tutor')} className="mx-2 text-dark">Relatório Geral Tutores</Nav.Link>
                            <Nav.Link onClick={() => navigate('/atribuir-papel')} className="mx-2 text-dark">Atribuir Papel</Nav.Link>
                        </Nav>

                        <div className="d-flex justify-content-center align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario?.nome}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <h1 className="fw-bold mb-4" style={{ color: '#0f52ba' }}>Configurações do Sistema</h1>

                {/* SEÇÃO 1: AJUSTE DE HORAS POR CATEGORIA */}
                <Form className='mb-5 p-4 bg-white rounded shadow-sm' onSubmit={handleSalvarHoras}>
                    <h2 className="h4 mb-4" style={{ color: '#0f52ba' }}>Carga Horária por Categoria</h2>
                    <Row>
                        <Col md={6} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Selecionar Categoria</Form.Label>
                                <Form.Select
                                    value={categoriaSelecionada}
                                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                                    required
                                >
                                    <option value="">Escolha...</option>
                                    <option value="estudos">Estudos individuais</option>
                                    <option value="monitoria">Monitoria</option>
                                    <option value="evento">Eventos</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Horas Necessárias</Form.Label>
                                <Form.Control
                                    type='number'
                                    disabled={!categoriaSelecionada}
                                    value={horasCategoria[categoriaSelecionada] || ""}
                                    onChange={(e) => setHorasCategoria({
                                        ...horasCategoria,
                                        [categoriaSelecionada]: e.target.value
                                    })}
                                    placeholder="Ex: 20"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit"><FaSave className="me-2" /> Salvar Regra</Button>
                    </div>
                </Form>

                {/* SEÇÃO 2 & 3: DATAS E ATRIBUIÇÃO DE TUTOR */}
                <Form className='mb-5 p-4 bg-white rounded shadow-sm' onSubmit={handleAtribuirTutoria}>
                    <h2 className="h4 mb-4" style={{ color: '#0f52ba' }}>Vincular Tutor e Aluno</h2>
                    <Row>
                        <Col md={3} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Data Início</Form.Label>
                                <Form.Control type='date' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={3} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Data Fim</Form.Label>
                                <Form.Control type='date' value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={3} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Tutor</Form.Label>
                                <Form.Select value={tutorSelecionado} onChange={(e) => setTutorSelecionado(e.target.value)} required>
                                    <option value="">Selecione...</option>
                                    {tutores.map(t => <option key={t.matricula} value={t.name}>{t.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3} className='mb-3'>
                            <Form.Group>
                                <Form.Label className='fw-bold'>Aluno</Form.Label>
                                <Form.Select value={alunoSelecionado} onChange={(e) => setAlunoSelecionado(e.target.value)} required>
                                    <option value="">Selecione...</option>
                                    {alunos.map(a => <option key={a.matricula} value={a.name}>{a.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end">
                        <Button variant="success" type="submit">Vincular Agora</Button>
                    </div>
                </Form>

                {/* LISTA DE VÍNCULOS ATUAIS */}
                <h2 className="h4 mb-3" style={{ color: '#0f52ba' }}>Atribuições Ativas</h2>
                {vinculos.map((v) => (
                    <Card key={v.id} className='mb-3 border-0 shadow-sm'>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className='text-primary mb-1'>Tutor: {v.tutorNome}</h5>
                                <p className='mb-0 text-muted'>
                                    <strong>Aluno:</strong> {v.alunoNome} |
                                    <strong> Período:</strong> {v.dataInicio} até {v.dataFim}
                                </p>
                            </div>
                            <Button variant="outline-danger" onClick={() => removerVinculo(v.id)}>Remover</Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default Predefinicoes;