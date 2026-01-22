import { Container, Row, Col, Button, Navbar, Nav, Form, Image } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';

function FormsTutor() {
    const navigate = useNavigate();
    const location = useLocation();

    const nomeAlunoSelecionado = location.state?.alunoNome || "João Silva de Lima Barreto";
    const [usuario] = useState(() => {
        const saved = localStorage.getItem("usuarioLogado");
        return saved ? JSON.parse(saved) : null;
    });

    const [dataAtual] = useState(() => {
        const hoje = new Date();
        return hoje.toLocaleDateString('pt-BR');
    });

    const [formData, setFormData] = useState({
        aluno: location.state?.aluno?.aluno || nomeAlunoSelecionado,
        virtuais: 0,
        presenciais: 0,
        dificuldadeTipo: 'selecionar',
        descricao: ''
    });

    useEffect(() => {
        if (!usuario) {
            navigate('/');
        } else if (usuario.role !== 'tutor') {
            alert("Acesso negado. Está página é exclusiva para tutores.");
            if (usuario.role === 'coordenador') navigate('/coordenador');
            else if (userParsed.role === 'bolsista') navigate('/bolsista');
            else if (userParsed.role === 'aluno') navigate('/aluno');
            else navigate('/');
        }
    }, [usuario, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate('/');
    };

    const handleSalvar = (e) => {
        e.preventDefault();
        const novoRelatorio = {
            id: Date.now(),
            aluno: formData.aluno,
            tutorNome: usuario.name,
            tutorMatricula: usuario?.matricula,
            matricula: location.state?.aluno?.matricula || "000000",
            data: dataAtual,
            status: "concluido",
            dificuldadeTipo: formData.dificuldadeTipo,
            encontrosTotais: Number(formData.virtuais) + Number(formData.presenciais),
            detalhes: formData
        };

        const relatoriosSalvos = JSON.parse(localStorage.getItem("relatorios_cadastrados") || "[]");
        relatoriosSalvos.push(novoRelatorio);
        localStorage.setItem("relatorios_cadastrados", JSON.stringify(relatoriosSalvos));
        alert(`Relatório de ${formData.aluno} enviado com sucesso!`);
        navigate('/relatorios-tutor');
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
                            <Nav.Link onClick={() => navigate('/home-tutor')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/alunos-tutor')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/forms-tutor')} className="mx-2 text-dark fw-bold" style={{ cursor: 'pointer' }}>Formulário</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorios-tutor')} className="mx-2 text-dark">Relatórios</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={handleLogout}>
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Button variant="link" className="text-decoration-none mb-3 p-0 d-flex align-items-center gap-2 text-secondary" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Voltar
                </Button>

                <div className="bg-white p-5 rounded-4 shadow-sm">
                    <h2 className="fw-bold mb-3" style={{ color: '#0f52ba' }}>Formulário de Acompanhamento</h2>
                    <p className="mb-1 text-dark">Prezado tutor,</p>
                    <p className="mb-3 text-dark">Relatório Mensal do mês, preencha até o dia 10 de julho.</p>
                    <p className="small mb-4 fw-bold" style={{ color: '#dc3545' }}>
                        (Obs: Se você não conseguiu entrar em contato com o tutorando, no campo de "Quais dificuldades o estudante apresentou durante o mês?" marque a opção outras e especifique no campo de texto.)
                    </p>

                    <Form onSubmit={handleSalvar}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formTutor">
                                    <Form.Label className="text-primary fw-medium">Tutor</Form.Label>
                                    <Form.Control type="text" value={usuario.name} readOnly className="bg-light" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formData">
                                    <Form.Label className="text-primary fw-medium">Data</Form.Label>
                                    <Form.Control type="text" value={dataAtual} readOnly className="bg-light" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formAluno">
                                    <Form.Label className="text-primary fw-medium">Tutorando</Form.Label>
                                    <Form.Control type="text" value={formData.aluno} onChange={(e) => setFormData({ ...formData, aluno: e.target.value })} placeholder="Nome do aluno" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formEncontrosVirtuais">
                                    <Form.Label className="text-primary fw-medium">Quantidade de encontros virtuais</Form.Label>
                                    <Form.Control type="number" value={formData.virtuais} onChange={(e) => setFormData({ ...formData, virtuais: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formEncontrosPresenciais">
                                    <Form.Label className="text-primary fw-medium">Quantidade de encontros presenciais</Form.Label>
                                    <Form.Control type="number" value={formData.presenciais} onChange={(e) => setFormData({ ...formData, presenciais: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDificuldades">
                                    <Form.Label className="text-primary fw-medium">Dificuldades dos alunos</Form.Label>
                                    <Form.Select value={formData.dificuldadeTipo} onChange={(e) => setFormData({ ...formData, dificuldadeTipo: e.target.value })}>
                                        <option>Selecionar</option>
                                        <option value="nenhuma">Nenhuma dificuldade</option>
                                        <option value="conteudo">Dificuldade com conteúdo</option>
                                        <option value="acesso">Problemas de acesso/internet</option>
                                        <option value="outras">Outras(Especificar abaixo)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4" controlId="formDescricao">
                            <Form.Label className="text-primary fw-medium">Descrição Detalhada</Form.Label>
                            <Form.Control as="textarea" rows={6} style={{ resize: 'none' }} value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descreva aqui qualquer outra dificuldade do aluno" />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit" className="px-4 py-2 fw-bold d-flex align-items-center gap-2" style={{ backgroundColor: '#0f52ba', borderColor: '#0f52ba' }}>
                                <FaSave /> Salvar Preenchimento
                            </Button>
                        </div>
                    </Form>
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

export default FormsTutor;