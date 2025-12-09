import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Image } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import LogoNextCertify from '../img/NextCertify.png';

function AvaliacaoTutoria() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        data: '',
        email: '',
        curso: '',
        permanecer: 'sim',
        experiencia: 50,
        dificuldade: '',
        avaliacaoTutor: 50,
        descricao: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Avaliação enviada:", formData);
        alert(`Avaliação de ${formData.nome} salva com sucesso!`);
        navigate('/aluno');
    };

    const getBackgroundStyle = (value) => {
        return {
            background: `linear-gradient(to right, #0d6efd 0%, #0d6efd ${value}%, #dee2e6 ${value}%, #dee2e6 100%)`
        };
    };

    // Vai preencher os campos com usuário logado e data atual
    useEffect(()=> {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        setFormData(prev => ({
            ...prev,
            nome: usuarioLogado?.name || prev.nome,
            email: usuarioLogado?.email || prev.email,
            data: prev.data || today
        }));
    }, []);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <style>{`
                .range-com-fill::-webkit-slider-runnable-track {
                    background: transparent !important; 
                }
                .range-com-fill::-moz-range-track {
                    background: transparent !important;
                }
                .range-com-fill {
                    height: 8px;
                    border-radius: 5px;
                    border: 1px solid #dee2e6;
                }
            `}</style>

            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" onClick={() => navigate('/aluno')} style={{cursor: 'pointer'}}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="mx-auto fw-medium">
                            <Nav.Link href="/aluno" className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link href="/meus-certificados" className="mx-2 text-dark">Certificados</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{JSON.parse(localStorage.getItem("usuarioLogado"))?.name || "usuário"}</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <div className="mb-4">
                    <h2 className="text-primary fw-bold">Avaliação do Projeto de Tutoria</h2>
                    <p className="text-muted">
                        Prezado estudante,<br/>
                        Nós do Projeto de Tutoria Acadêmica gostaríamos de saber um pouco sobre como foi a sua experiência no projeto para que possamos melhorá-lo cada vez mais.
                    </p>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-primary fw-bold">Aluno(a)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    id="nome"
                                    placeholder="Digite seu nome completo"
                                    value={formData.nome} 
                                    onChange={handleChange}
                                    readOnly
                                    disabled 
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-primary fw-bold">Data</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    id="data"
                                    value={formData.data} 
                                    onChange={handleChange}
                                    disabled
                                    required 
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-primary fw-bold">E-mail</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    id="email"
                                    placeholder="seu.email@exemplo.com"
                                    value={formData.email} 
                                    onChange={handleChange}
                                    readOnly
                                    disabled
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-primary fw-bold">Curso</Form.Label>
                                <Form.Select id="curso" value={formData.curso} onChange={handleChange} required>
                                    <option value="">Selecionar</option>
                                    <option value="CC">Ciência da Computação</option>
                                    <option value="SI">Sistemas de Informação</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6} className='mb-3'>
                            <Form.Label className="text-primary fw-bold">Você deseja permanecer sendo acompanhado(a) por um tutor no semestre 2025.2?</Form.Label>
                            <div className="mt-2">
                                <Form.Check
                                    inline
                                    label="Sim"
                                    name="permanecer"
                                    type="radio"
                                    id="sim"
                                    value="sim"
                                    checked={formData.permanecer === 'sim'}
                                    onChange={(e) => setFormData({...formData, permanecer: e.target.value})}
                                />
                                <Form.Check
                                    inline
                                    label="Não"
                                    name="permanecer"
                                    type="radio"
                                    id="nao"
                                    value="nao"
                                    checked={formData.permanecer === 'nao'}
                                    onChange={(e) => setFormData({...formData, permanecer: e.target.value})}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <Form.Label className="text-primary fw-bold mb-0">Como foi a sua experiência?</Form.Label>
                                <span className="badge bg-primary fs-6">{formData.experiencia}%</span>
                            </div>
                            
                            <Form.Range 
                                id="experiencia" 
                                min="0" 
                                max="100" 
                                value={formData.experiencia} 
                                onChange={handleChange}
                                className="range-com-fill" 
                                style={getBackgroundStyle(formData.experiencia)}
                            />
                            
                            <div className="d-flex justify-content-between text-muted small mt-1">
                                <span>0% Ruim</span>
                                <span>Ótimo 100%</span>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={6} className='mb-3'>
                            <Form.Group>
                                <Form.Label className="text-primary fw-bold">Quais dificuldades você teve ao longo do semestre durante o acompanhamento?</Form.Label>
                                <Form.Select id="dificuldade" value={formData.dificuldade} onChange={handleChange} required>
                                    <option value="">Selecionar</option>
                                    <option value="Horario">Horário</option>
                                    <option value="Conteudo">Conteúdo</option>
                                    <option value="Didatica">Tutor não entrou em contato.</option>
                                    <option value="Outro">Outro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <Form.Label className="text-primary fw-bold mb-0">Avaliação do Tutor</Form.Label>
                                <span className="badge bg-primary fs-6">{formData.avaliacaoTutor}%</span>
                            </div>

                            <Form.Range 
                                id="avaliacaoTutor" 
                                min="0" 
                                max="100" 
                                value={formData.avaliacaoTutor} 
                                onChange={handleChange} 
                                className="range-com-fill"
                                style={getBackgroundStyle(formData.avaliacaoTutor)}
                            />

                            <div className="d-flex justify-content-between text-muted small mt-1">
                                <span>0% Ruim</span>
                                <span>Ótimo 100%</span>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <Form.Group>
                                <Form.Label className="text-primary fw-bold">Descrição da dificuldade</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    id="descricao"
                                    rows={5} 
                                    style={{ resize: 'none' }}
                                    value={formData.descricao}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" className="px-4 py-2" style={{borderRadius: '10px'}}>
                            Salvar Preenchimento
                        </Button>
                    </div>

                </Form>
            </Container>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default AvaliacaoTutoria;