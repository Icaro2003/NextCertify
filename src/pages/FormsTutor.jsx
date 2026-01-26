import { Container, Row, Col, Button, Navbar, Nav, Form, Image, Spinner } from 'react-bootstrap';

import { FaBell, FaUserCircle, FaSignOutAlt, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import formAcompanhamentoService from '../services/formAcompanhamentoService';

function FormsTutor() {
    const navigate = useNavigate();
    const location = useLocation();

    const { usuario, token, userRole, handleLogout } = useAuthenticatedUser();

    const [dataAtual] = useState(() => {
        const hoje = new Date();
        return hoje.toLocaleDateString('pt-BR');
    });

    const [formData, setFormData] = useState({
        aluno: location.state?.alunoNome || "",
        bolsistaId: location.state?.bolsistaId || "",
        periodoId: location.state?.periodoId || "",
        virtuais: 0,
        presenciais: 0,
        dificuldadeTipo: 'selecionar',
        descricao: ''
    });

    const [enviando, setEnviando] = useState(false);


    const handleSalvar = async (e) => {
        e.preventDefault();

        if (!formData.bolsistaId || !formData.periodoId) {
            alert("Erro: Dados do aluno ou período não identificados. Volte para a lista de alunos e tente novamente.");
            return;
        }

        if (formData.dificuldadeTipo === 'selecionar') {
            alert("Por favor, selecione uma dificuldade.");
            return;
        }

        // Mapear modalidade: se houver encontros em ambos, prioriza o que tiver mais ou define um padrão
        const modalidade = Number(formData.virtuais) >= Number(formData.presenciais) ? 'VIRTUAL' : 'PRESENCIAL';

        const payload = {
            tutorId: usuario.tutor.id,
            bolsistaId: formData.bolsistaId,
            periodoId: formData.periodoId,
            modalidadeReuniao: modalidade,
            maiorDificuldadeAluno: formData.dificuldadeTipo,
            quantidadeReunioes: Number(formData.virtuais) + Number(formData.presenciais),
            quantidadeVirtuais: Number(formData.virtuais),
            quantidadePresenciais: Number(formData.presenciais),
            descricaoDificuldade: formData.descricao,
            observacoes: "" // Campo extra se necessário futuramente
        };


        try {
            setEnviando(true);
            await formAcompanhamentoService.createForm(payload, token);
            alert(`Relatório de ${formData.aluno} enviado com sucesso!`);
            navigate('/relatorios-tutor');
        } catch (error) {
            alert(error.message);
        } finally {
            setEnviando(false);
        }
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
                                    <Form.Control type="text" value={usuario.nome} readOnly className="bg-light" />
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
                                    <Form.Control type="text" value={formData.aluno} readOnly className="bg-light" />
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
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={enviando}
                                className="px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                style={{ backgroundColor: '#0f52ba', borderColor: '#0f52ba' }}
                            >
                                {enviando ? <Spinner size="sm" /> : <FaSave />}
                                {enviando ? 'Salvando...' : 'Salvar Preenchimento'}
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