import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Image } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
// Importe seu mock de usuários para listar os tutores
import mockAut from '../mocks/auth-mock.json'; 

function AvaliacaoTutoria() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(() => {
        const saved = localStorage.getItem("usuarioLogado");
        return saved ? JSON.parse(saved) : null;
    });

    const [listaTutores, setListaTutores] = useState([]);

    const [formData, setFormData] = useState(() => {
        const today = new Date().toISOString().slice(0, 10);
        return {
            nome: usuario?.name || '', 
            data: today,
            email: usuario?.email || '',
            curso: '',
            permanecer: 'sim',
            experiencia: 50,
            tutorId: '', // Novo campo
            tutorNome: '', // Novo campo
            dificuldade: '',
            avaliacaoTutor: 50,
            descricao: ''
        };
    });

    useEffect(() => {
        if (!usuario) {
            navigate('/');
        } else if (usuario.role !== 'aluno') {
            alert("Acesso negado. Esta página é exclusiva para alunos.");
            navigate('/');
        }

        // Carregar tutores do mock
        const usuarios = Array.isArray(mockAut) ? mockAut : (mockAut.users || []);
        const tutoresEncontrados = usuarios.filter(u => u.role === 'tutor');
        setListaTutores(tutoresEncontrados);
    }, [usuario, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        // Lógica especial para salvar o nome do tutor junto com o ID
        if (id === "tutorId") {
            const tutorSelecionado = listaTutores.find(t => t.matricula === value);
            setFormData({ 
                ...formData, 
                tutorId: value, 
                tutorNome: tutorSelecionado ? tutorSelecionado.name : '' 
            });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.tutorId) {
            alert("Por favor, selecione o tutor que acompanhou você.");
            return;
        }

        const avaliacaoSalvas = JSON.parse(localStorage.getItem("@App:avaliacao") || "[]");
        const novaAvaliacao = {
            ...formData,
            id: Date.now(),
        };

        const listaAtualizada = [...avaliacaoSalvas, novaAvaliacao];
        localStorage.setItem("@App:avaliacao", JSON.stringify(listaAtualizada));
        alert(`Avaliação enviada com sucesso!`);
        navigate('/aluno');
    };

    const getBackgroundStyle = (value) => ({
        background: `linear-gradient(to right, #0d6efd 0%, #0d6efd ${value}%, #dee2e6 ${value}%, #dee2e6 100%)`
    });

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand onClick={() => navigate('/aluno')} style={{ cursor: 'pointer' }}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="mx-auto fw-medium">
                            <Nav.Link href="/aluno">Home</Nav.Link>
                            <Nav.Link href="/meus-certificados">Certificados</Nav.Link>
                            <Nav.Link href="/contato">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold">{formData.nome}</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <div className="mb-4 text-center text-md-start">
                    <h2 className="text-primary fw-bold">Avaliação do Projeto de Tutoria</h2>
                    <p className="text-muted">Sua opinião ajuda a melhorar o suporte acadêmico.</p>
                </div>

                <Form onSubmit={handleSubmit}>
                    {/* Seção Dados do Aluno */}
                    <Row className="mb-3">
                        <Col md={6} className="mb-3">
                            <Form.Label className="text-primary fw-bold">Aluno(a)</Form.Label>
                            <Form.Control value={formData.nome} disabled className="bg-light" />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="text-primary fw-bold">Curso</Form.Label>
                            <Form.Select id="curso" value={formData.curso} onChange={handleChange} required>
                                <option value="">Selecionar Curso</option>
                                <option value="CC">Ciência da Computação</option>
                                <option value="SI">Sistemas de Informação</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* SEÇÃO NOVA: SELEÇÃO DO TUTOR */}
                    <hr className="my-4" />
                    <Row className="mb-4">
                        <Col md={12}>
                            <h5 className="text-primary fw-bold mb-3">Quem foi seu Tutor?</h5>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Selecione o Tutor acompanhante</Form.Label>
                                <Form.Select 
                                    id="tutorId" 
                                    value={formData.tutorId} 
                                    onChange={handleChange} 
                                    required
                                    style={{ border: '2px solid #0d6efd' }}
                                >
                                    <option value="">Clique para selecionar</option>
                                    {listaTutores.map(t => (
                                        <option key={t.matricula} value={t.matricula}>
                                            {t.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <p className="text-muted small mb-2">
                                * Se o seu tutor não estiver na lista, entre em contato com a coordenação.
                            </p>
                        </Col>
                    </Row>

                    {/* Avaliações em Range */}
                    <Row className="mb-4">
                        <Col md={6} className="mb-4">
                            <div className="d-flex justify-content-between">
                                <Form.Label className="text-primary fw-bold">Nota para o Tutor: {formData.tutorNome}</Form.Label>
                                <span className="badge bg-primary">{formData.avaliacaoTutor}%</span>
                            </div>
                            <Form.Range
                                id="avaliacaoTutor"
                                min="0" max="100"
                                value={formData.avaliacaoTutor}
                                onChange={handleChange}
                                style={getBackgroundStyle(formData.avaliacaoTutor)}
                            />
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between">
                                <Form.Label className="text-primary fw-bold">Sua experiência geral</Form.Label>
                                <span className="badge bg-primary">{formData.experiencia}%</span>
                            </div>
                            <Form.Range
                                id="experiencia"
                                min="0" max="100"
                                value={formData.experiencia}
                                onChange={handleChange}
                                style={getBackgroundStyle(formData.experiencia)}
                            />
                        </Col>
                    </Row>

                    {/* Dificuldades */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Label className="text-primary fw-bold">Maior dificuldade encontrada</Form.Label>
                            <Form.Select id="dificuldade" value={formData.dificuldade} onChange={handleChange} required>
                                <option value="">Selecionar</option>
                                <option value="Horario">Conciliação de Horários</option>
                                <option value="Conteudo">Complexidade do Conteúdo</option>
                                <option value="Comunicacao">Comunicação com o Tutor</option>
                                <option value="Outro">Outro (Descrever abaixo)</option>
                            </Form.Select>
                        </Col>
                        <Col md={6}>
                            <Form.Label className="text-primary fw-bold">Deseja continuar no projeto em 2025.2?</Form.Label>
                            <div className="mt-2">
                                <Form.Check inline label="Sim" name="perm" type="radio" checked={formData.permanecer === 'sim'} onChange={() => setFormData({...formData, permanecer: 'sim'})} />
                                <Form.Check inline label="Não" name="perm" type="radio" checked={formData.permanecer === 'nao'} onChange={() => setFormData({...formData, permanecer: 'nao'})} />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <Form.Label className="text-primary fw-bold">Comentários Adicionais</Form.Label>
                            <Form.Control as="textarea" id="descricao" rows={4} value={formData.descricao} onChange={handleChange} placeholder="Conte-nos mais detalhes..." />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={() => navigate('/aluno')}>Cancelar</Button>
                        <Button variant="primary" type="submit" className="px-5 fw-bold">Enviar Avaliação</Button>
                    </div>
                </Form>
            </Container>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '20px 0', textAlign: 'center', color: 'white' }}>
                <h5 className="mb-0">© 2025 - NextCertify</h5>
            </footer>
        </div>
    );
}

export default AvaliacaoTutoria;