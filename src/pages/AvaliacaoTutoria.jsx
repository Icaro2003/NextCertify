import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Image, Spinner } from 'react-bootstrap';

import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import avaliacaoTutoriaService from '../services/avaliacaoTutoriaService';
import predefinicoesService from '../services/predefinicoesService';
import roleService from '../services/roleService';


function AvaliacaoTutoria() {
    const navigate = useNavigate();

    const { usuario, token, userRole, handleLogout } = useAuthenticatedUser();

    const [formData, setFormData] = useState({
        nome: '',
        data: new Date().toISOString().slice(0, 10),
        email: '',
        curso: '',
        anoIngresso: '',

        // Tutor
        tutorId: '',
        tutorNome: 'Não atribuído',

        // Avaliação
        periodoId: '',
        nivelSatisfacaoGeral: 50,
        dificuldades: '',
        comentarioGeral: '',
        recomendariaPrograma: false,
        justificativaRecomendacao: '',
        periodoAvaliadoText: ''
    });

    useEffect(() => {
        if (usuario) {
            const roleTraduzida = userRole(usuario.role).toLowerCase();


            if (roleTraduzida !== 'bolsista') {
                alert("Acesso negado. Esta página é exclusiva para bolsistas.");
                navigate('/');
            }
            console.log(usuario);
            if (formData.nome === '') {
                setFormData(prev => ({
                    ...prev,
                    nome: usuario.nome || '',
                    email: usuario.email || '',
                    curso: usuario.bolsista?.curso || '',
                    anoIngresso: usuario.bolsista?.anoIngresso || ''

                }));
            }
        }
    }, [usuario, navigate, userRole, formData.nome]);

    const [listaTutores, setListaTutores] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            if (!token || !usuario) return;

            try {
                setCarregando(true);
                const [tutores, activePeriods, vinculos] = await Promise.all([
                    predefinicoesService.listTutors(token),
                    avaliacaoTutoriaService.listActivePeriods(token),
                    predefinicoesService.listVinculos(null, token)
                ]);

                setListaTutores(tutores);
                setPeriodos(activePeriods);

                // Tentar encontrar o tutor vinculado ao aluno logado
                const meuVinculo = vinculos.find(v => (usuario.bolsista && v.bolsistaId === usuario.bolsista.id) || v.usuarioId === usuario.id);

                if (meuVinculo) {
                    const tutor = tutores.find(t => t.tutor && t.tutor.id === meuVinculo.tutorId);
                    const dtInicio = new Date(meuVinculo.dataInicio).toLocaleDateString();
                    const dtFim = meuVinculo.dataFim ? new Date(meuVinculo.dataFim).toLocaleDateString() : 'Indefinido';

                    setFormData(prev => ({
                        ...prev,
                        tutorId: meuVinculo.tutorId,
                        tutorNome: tutor ? tutor.nome : 'Tutor vinculado',
                        periodoId: meuVinculo.periodoId, // Sincronizando o período do vínculo
                        periodoAvaliadoText: `${dtInicio} até ${dtFim}`
                    }));
                }


                if (activePeriods.length > 0) {
                    setFormData(prev => ({ ...prev, periodoId: activePeriods[0].id }));
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setCarregando(false);
            }
        };

        carregarDadosIniciais();
    }, [token, usuario]);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.tutorNome === 'Tutor não encontrado' || formData.tutorNome === 'Não atribuído') {
            alert("Erro: Você não possui um tutor vinculado para avaliar.");
            return;
        }

        const mapSatisfacao = (val) => {
            if (val <= 20) return 'MUITO_INSATISFEITO';
            if (val <= 40) return 'INSATISFEITO';
            if (val <= 60) return 'NEUTRO';
            if (val <= 80) return 'SATISFEITO';
            return 'MUITO_SATISFEITO';
        };

        const payload = {
            periodoId: formData.periodoId,
            tipoAvaliador: 'ALUNO',
            aspectosPositivos: [],
            aspectosNegativos: [],
            sugestoesMelhorias: [],
            comentarioGeral: formData.comentarioGeral,
            dificuldadesComunicacao: formData.dificuldades === 'dificuldadesComunicacao' ? 'Sim' : '',
            dificuldadesConteudo: formData.dificuldades === 'dificuldadesConteudo' ? 'Sim' : '',
            dificuldadesMetodologicas: formData.dificuldades === 'dificuldadesMetodologicas' ? 'Sim' : '',
            dificuldadesRecursos: formData.dificuldades === 'dificuldadesRecursos' ? 'Sim' : '',
            outrasDificuldades: formData.dificuldades === 'outrasDificuldades' ? formData.comentarioGeral : '',
            nivelSatisfacaoGeral: mapSatisfacao(formData.nivelSatisfacaoGeral),
            recomendariaPrograma: formData.recomendariaPrograma,
            justificativaRecomendacao: formData.justificativaRecomendacao || formData.comentarioGeral,
            periodoAvaliado: formData.periodoAvaliadoText
        };

        try {
            await avaliacaoTutoriaService.createAvaliacaoTutoria(payload, token);
            alert(`Avaliação enviada com sucesso!`);
            navigate('/bolsista');
        } catch (error) {
            alert(error.message);
        }
    };


    const getBackgroundStyle = (value) => ({
        background: `linear-gradient(to right, #0d6efd 0%, #0d6efd ${value}%, #dee2e6 ${value}%, #dee2e6 100%)`
    });

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
                    <Navbar.Collapse>
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link onClick={() => navigate('/bolsista')} className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/meus-certificados')} className="mx-2 text-dark">Certificados</Nav.Link>
                            <Nav.Link className="mx-2 text-dark fw-bold">Avaliação Tutoria</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario?.nome || 'Carregando...'}</span>
                            </div >
                            <Button variant="outline-danger" size="sim" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div >
                    </Navbar.Collapse >
                </Container >
            </Navbar >

            <Container className="my-5 flex-grow-1">
                <div className="mb-4 text-center text-md-start">
                    <h2 className="text-primary fw-bold">Avaliação do Projeto de Tutoria</h2>
                    <p className="text-muted">Sua opinião ajuda a melhorar o suporte acadêmico.</p>
                    <p className="text-muted">Data da avaliação: <strong>{new Date().toLocaleDateString()}</strong></p>
                </div>

                {carregando ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Carregando dados necessários...</p>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">

                        <Row className="mb-3">
                            <Col md={4} className="mb-3">
                                <Form.Label className="text-primary fw-bold">Aluno(a)</Form.Label>
                                <Form.Control value={formData.nome} disabled className="bg-light" />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="text-primary fw-bold">Curso</Form.Label>
                                <Form.Control value={formData.curso} disabled className="bg-light" />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="text-primary fw-bold">Tutor Vinculado</Form.Label>
                                <Form.Control value={formData.tutorNome} disabled className={`fw-bold ${formData.tutorNome === 'Tutor não encontrado' ? 'text-danger' : 'text-success'}`} />
                            </Col >
                        </Row >

                        <hr className="my-4" />
                        {/* <Row className="mb-4">
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
                                            <option key={t.id} value={t.id}>
                                                {t.nome}
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
                        </Row> */}

                        <Row className="mb-4">
                            <Col md={6} className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <Form.Label className="text-primary fw-bold">Sua satisfação geral</Form.Label>
                                    <span className="badge bg-primary">{formData.nivelSatisfacaoGeral}%</span>
                                </div>
                                <Form.Range id="nivelSatisfacaoGeral" value={formData.nivelSatisfacaoGeral} onChange={handleChange} style={getBackgroundStyle(formData.nivelSatisfacaoGeral)} />
                            </Col>

                            <Col md={6}>
                                <Form.Label className="text-primary fw-bold">Deseja continuar no projeto em {`${new Date().getFullYear()}${usuario.semestre || ''}`}?</Form.Label>
                                <div className="mt-2">
                                    <Form.Check id='recomendariaProgramaSim' label="Sim" name="perm" type="radio" checked={formData.recomendariaPrograma === true} onChange={() => setFormData({ ...formData, recomendariaPrograma: true })} />
                                    <Form.Check id='recomendariaProgramaNao' label="Não" name="perm" type="radio" checked={formData.recomendariaPrograma === false} onChange={() => setFormData({ ...formData, recomendariaPrograma: false })} />
                                </div>
                            </Col>
                        </Row>

                        {/* Dificuldades */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label className="text-primary fw-bold">Período de Tutoria</Form.Label>
                                {formData.periodoAvaliadoText ? (
                                    <Form.Control
                                        value={formData.periodoAvaliadoText}
                                        disabled
                                        className="bg-light fw-bold"
                                    />
                                ) : (
                                    <Form.Select id="periodoId" value={formData.periodoId} onChange={handleChange} required>
                                        {periodos.map(p => (
                                            <option key={p.id} value={p.id}>{p.semestre}/{p.ano}</option>
                                        ))}
                                    </Form.Select>
                                )}
                            </Col>


                            <Col md={6}>
                                <Form.Label className="text-primary fw-bold">Maior dificuldade encontrada</Form.Label>
                                <Form.Select
                                    id="dificuldades"
                                    value={formData.dificuldades}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecionar</option>
                                    <option value="dificuldadesComunicacao">Comunicação com o Tutor</option>
                                    <option value="dificuldadesConteudo">Complexidade do Conteúdo</option>
                                    <option value="dificuldadesMetodologicas">Metodologia</option>
                                    <option value="dificuldadesRecursos">Recursos</option>
                                    <option value="outrasDificuldades">Outro (Descrever ao lado)</option>
                                </Form.Select>


                            </Col>
                        </Row>



                        <Row className="mb-4">
                            <Col>
                                <Form.Label className="text-primary fw-bold">Comentários e Justificativa</Form.Label>
                                <Form.Control as="textarea" id="comentarioGeral" rows={3} value={formData.comentarioGeral} onChange={handleChange} placeholder="Conte-nos sua experiência geral e por que recomenda (ou não) o programa..." required />
                            </Col>
                        </Row>



                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-secondary" onClick={() => navigate('/aluno')}>Cancelar</Button>
                            <Button variant="primary" type="submit" className="px-5 fw-bold" disabled={formData.tutorNome === 'Tutor não encontrado'}>Enviar Avaliação</Button>
                        </div>
                    </Form >
                )}
            </Container >


            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '20px 0', textAlign: 'center', color: 'white' }}>
                <h5 className="mb-0">© 2025 - NextCertify</h5>
            </footer>
        </div >
    );
}

export default AvaliacaoTutoria;