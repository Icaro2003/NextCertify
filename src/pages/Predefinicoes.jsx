import { Container, Row, Col, Button, Navbar, Nav, Form, Image, Card, Spinner, Modal, Badge } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import predefinicoesService from '../services/predefinicoesService';
import roleService from '../services/roleService';

function Predefinicoes() {
    const navigate = useNavigate();
    const { usuario, token, handleLogout } = useAuthenticatedUser();


    const [periodos, setPeriodos] = useState([]);
    const [periodoSelecionado, setPeriodoSelecionado] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [horasMinimas, setHorasMinimas] = useState("");
    const [tutorSelecionado, setTutorSelecionado] = useState("");
    const [alunoSelecionado, setAlunoSelecionado] = useState("");
    const [dataInicioVinculo, setDataInicioVinculo] = useState("");
    const [dataFimVinculo, setDataFimVinculo] = useState("");


    const [tutores, setTutores] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [vinculos, setVinculos] = useState([]);
    const [cargasHorarias, setCargasHorarias] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const [showNewPeriodModal, setShowNewPeriodModal] = useState(false);
    const [novoPeriodoForm, setNovoPeriodoForm] = useState({
        nome: '',
        dataInicio: '',
        dataFim: '',
        descricao: '',
        ativo: true
    });


    useEffect(() => {

        carregarDados();
    }, [token]);

    useEffect(() => {
        if (periodoSelecionado && token) {
            carregarVinculos();
            carregarCargas(periodoSelecionado);

            const p = periodos.find(p => p.id === periodoSelecionado);
            if (p) {
                setDataInicioVinculo(p.dataInicio ? new Date(p.dataInicio).toISOString().split('T')[0] : '');
                setDataFimVinculo(p.dataFim ? new Date(p.dataFim).toISOString().split('T')[0] : '');
            }
        }
    }, [periodoSelecionado, token, periodos]);


    const carregarCargas = async (id) => {
        try {
            const data = await predefinicoesService.listCargasHorarias(id, token);
            setCargasHorarias(data);
        } catch (error) {
            console.error("Erro ao carregar cargas horárias:", error);
        }
    };

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [periodosData, tutoresData, alunosData, todosUsersData] = await Promise.all([
                predefinicoesService.listPeriodos(token),
                predefinicoesService.listTutors(token),
                predefinicoesService.listScholarshipHolders(token),
                roleService.listAllUsers(token)
            ]);

            const periodosList = Array.isArray(periodosData) ? periodosData : (periodosData.periodos || []);

            setPeriodos(periodosList);
            setTutores(tutoresData);
            setAlunos(alunosData);
            setTodosUsuarios(todosUsersData);

            if (periodosList.length > 0) {
                const periodoAtivo = periodosList.find(p => p.ativo) || periodosList[0];
                setPeriodoSelecionado(periodoAtivo.id);
                await carregarCargas(periodoAtivo.id);
            }

        } catch (error) {
            console.error("Erro ao carregar dados:", error);

            alert(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setCarregando(false);

        }
    };

    const carregarVinculos = async () => {
        try {
            const vinculosData = await predefinicoesService.listVinculos({ periodoId: periodoSelecionado }, token);
            setVinculos(vinculosData);
        } catch (error) {

            console.error("Erro ao carregar vínculos:", error);
        }
    };

    const handleCreatePeriod = async (e) => {
        e.preventDefault();
        try {
            setCarregando(true);
            const payload = {
                ...novoPeriodoForm,
                dataInicio: new Date(novoPeriodoForm.dataInicio).toISOString(),
                dataFim: new Date(novoPeriodoForm.dataFim).toISOString()
            };

            await predefinicoesService.createPeriodo(payload, token);
            alert("Período criado com sucesso!");
            setShowNewPeriodModal(false);
            setNovoPeriodoForm({
                nome: '',
                dataInicio: '',
                dataFim: '',
                descricao: '',
                ativo: true
            });
            await carregarDados();
        } catch (error) {
            alert(`Erro ao criar período: ${error.message}`);
        } finally {
            setCarregando(false);
        }
    };

    const handleSalvarHoras = async (e) => {

        e.preventDefault();
        if (!periodoSelecionado) {
            alert("Selecione um período de tutoria primeiro!");
            return;
        }

        try {
            await predefinicoesService.saveCargaHoraria(
                periodoSelecionado,
                categoriaSelecionada,
                parseInt(horasMinimas),
                token
            );
            alert("Configuração de horas salva com sucesso!");
            setCategoriaSelecionada("");
            setHorasMinimas("");
            carregarCargas(periodoSelecionado);
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    };

    const handleRemoverCarga = async (id) => {
        if (!window.confirm("Deseja realmente remover esta regra de carga horária?")) return;
        try {
            await predefinicoesService.deleteCargaHoraria(id, token);
            alert("Regra removida com sucesso!");
            carregarCargas(periodoSelecionado);
        } catch (error) {
            alert(`Erro ao remover: ${error.message}`);
        }
    };

    const handleAtribuirTutoria = async (e) => {
        e.preventDefault();
        if (!periodoSelecionado) {
            alert("Selecione um período de tutoria primeiro!");
            return;
        }

        if (!tutorSelecionado || !alunoSelecionado) return;

        try {
            const payload = {
                tutorId: tutorSelecionado,
                bolsistaId: alunoSelecionado,
                periodoId: periodoSelecionado,
                dataInicio: new Date(dataInicioVinculo).toISOString(),
                dataFim: dataFimVinculo ? new Date(dataFimVinculo).toISOString() : null,
                ativo: true
            };



            await predefinicoesService.createVinculo(payload, token);
            alert("Vínculo criado com sucesso!");

            setTutorSelecionado("");
            setAlunoSelecionado("");

            carregarVinculos();
        } catch (error) {
            alert(`Erro ao criar vínculo: ${error.message}`);
        }
    };

    const removerVinculo = async (id) => {
        if (!window.confirm("Deseja realmente remover este vínculo?")) return;

        try {
            await predefinicoesService.deleteVinculo(id, token);
            alert("Vínculo removido com sucesso!");
            carregarVinculos();
        } catch (error) {
            alert(`Erro ao remover vínculo: ${error.message}`);
        }
    };

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    if (!usuario) return <div className='p-5 text-center'>Carregando....</div>;

    const periodoAtual = periodos.find(p => p.id === periodoSelecionado);


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
                            <Nav.Link onClick={() => navigate('/coordenador')} className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-aluno')} className="mx-2 text-dark">Registro Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-tutores')} className="mx-2 text-dark">Registro Tutores</Nav.Link>
                            <Nav.Link onClick={() => navigate('/predefinicoes')} className="mx-2 text-dark fw-bold">Predefinições</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-tutor')} className="mx-2 text-dark">Relatório Tutor</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-aluno')} className="mx-2 text-dark">Relatório Aluno</Nav.Link>
                            <Nav.Link onClick={() => navigate('/validar-certificados')} className="mx-2 text-dark">Validar Certificados</Nav.Link>
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

                <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                        <Row className="align-items-end">
                            <Col md={10}>
                                <Form.Group>
                                    <Form.Label className="fw-bold">Período de Tutoria Ativo</Form.Label>
                                    <Form.Select
                                        value={periodoSelecionado}
                                        onChange={(e) => setPeriodoSelecionado(e.target.value)}
                                        disabled={carregando}
                                    >
                                        <option value="">Selecione um período...</option>
                                        {periodos.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nome} ({new Date(p.dataInicio).toLocaleDateString()} - {new Date(p.dataFim).toLocaleDateString()})
                                                {p.ativo && ' ✓ Ativo'}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-grid">
                                <Button variant="primary" className='rounded-5' onClick={() => setShowNewPeriodModal(true)}>
                                    <FaPlus className="me-1" /> Novo Período
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>


                {carregando ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
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
                                            <option value="ESTUDOS_INDIVIDUAIS">Estudos Individuais</option>
                                            <option value="MONITORIA">Monitoria</option>
                                            <option value="EVENTOS">Eventos</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6} className='mb-3'>
                                    <Form.Group>
                                        <Form.Label className='fw-bold'>Horas Mínimas Necessárias</Form.Label>
                                        <Form.Control
                                            type='number'
                                            disabled={!categoriaSelecionada}
                                            value={horasMinimas}
                                            onChange={(e) => setHorasMinimas(e.target.value)}
                                            placeholder="Ex: 20"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                {console.log('Debug Salvar Regra:', { periodoSelecionado, categoriaSelecionada, horasMinimas })}
                                <Button variant="primary" type="submit" disabled={!periodoSelecionado || !categoriaSelecionada || !horasMinimas}>
                                    <FaSave className="me-2" /> Salvar Regra

                                </Button>
                            </div>
                        </Form>



                        <div className="mb-5">
                            <h3 className="h5 mb-3" style={{ color: '#0f52ba' }}>Regras Salvas para este Período</h3>
                            <Row>
                                {cargasHorarias.length === 0 ? (
                                    <Col><p className="text-muted">Nenhuma regra definida.</p></Col>
                                ) : (
                                    cargasHorarias.map(c => (
                                        <Col md={4} key={c.id} className="mb-3">
                                            <Card className="border-0 shadow-sm">
                                                <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                                    <div>
                                                        <span className="fw-bold">{c.categoria === 'EVENTOS' ? 'Eventos' : c.categoria === 'MONITORIA' ? 'Monitoria' : 'Estudos Individuais'}:</span>
                                                        <span className="ms-2">{c.horasMinimas}h</span>
                                                    </div>
                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleRemoverCarga(c.id)}>
                                                        <FaTrash size={14} />
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                            {cargasHorarias.length > 0 && (
                                <div className="text-end mt-2">
                                    <Badge bg="primary" className="p-2">
                                        Total do Período: {cargasHorarias.reduce((acc, curr) => acc + curr.horasMinimas, 0)}h
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <Form className='mb-5 p-4 bg-white rounded shadow-sm' onSubmit={handleAtribuirTutoria}>

                            <h2 className="h4 mb-4" style={{ color: '#0f52ba' }}>Vincular Tutor e Aluno</h2>


                            <Row>
                                {periodoAtual && (
                                    <>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Início da Tutoria</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={dataInicioVinculo}
                                                    onChange={(e) => setDataInicioVinculo(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label className="fw-bold">Fim da Tutoria</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={dataFimVinculo}
                                                    onChange={(e) => setDataFimVinculo(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                    </>
                                )}
                                <Col md={3} className='mb-3'>
                                    <Form.Group>
                                        <Form.Label className='fw-bold'>Tutor</Form.Label>
                                        <Form.Select value={tutorSelecionado} onChange={(e) => setTutorSelecionado(e.target.value)} required>
                                            <option value="">Selecione...</option>
                                            {tutores.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3} className='mb-3'>
                                    <Form.Group>
                                        <Form.Label className='fw-bold'>Aluno</Form.Label>
                                        <Form.Select value={alunoSelecionado} onChange={(e) => setAlunoSelecionado(e.target.value)} required>
                                            <option value="">Selecione...</option>
                                            {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                <Button variant="success" type="submit" disabled={!periodoSelecionado || !tutorSelecionado || !alunoSelecionado}>
                                    Vincular Agora
                                </Button>
                            </div>
                        </Form>

                        <h2 className="h4 mb-3" style={{ color: '#0f52ba' }}>Atribuições Ativas</h2>
                        {vinculos.length === 0 ? (
                            <Card className="mb-3 border-0 shadow-sm">
                                <Card.Body className="text-center text-muted py-5">
                                    Nenhum vínculo cadastrado para este período.
                                </Card.Body>
                            </Card>
                        ) : (
                            vinculos.map((v) => {
                                const tutor = todosUsuarios.find(u => u.id === v.tutorId || u.tutor?.id === v.tutorId);
                                const aluno = todosUsuarios.find(u => u.id === v.bolsistaId || u.bolsista?.id === v.bolsistaId);

                                return (
                                    <Card key={v.id} className='mb-3 border-0 shadow-sm'>
                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className='text-primary mb-1'>Tutor: {tutor?.nome || 'Não encontrado'}</h5>
                                                <p className='mb-0 text-muted'>
                                                    <strong>Aluno:</strong> {aluno?.nome || 'Não encontrado'} |
                                                    <strong> Período:</strong> {new Date(v.dataInicio).toLocaleDateString()} até {new Date(v.dataFim).toLocaleDateString()}
                                                    {v.ativo && <span className="badge bg-success ms-2">Ativo</span>}
                                                </p>
                                            </div>
                                            <Button variant="outline-danger" onClick={() => removerVinculo(v.id)}>Remover</Button>
                                        </Card.Body>
                                    </Card>
                                );
                            })
                        )}

                    </>
                )}
            </Container>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

            <Modal show={showNewPeriodModal} onHide={() => setShowNewPeriodModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold text-primary">Novo Período de Tutoria</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreatePeriod}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Nome do Período</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 2024.1"
                                value={novoPeriodoForm.nome}
                                onChange={(e) => setNovoPeriodoForm({ ...novoPeriodoForm, nome: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Data Início</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={novoPeriodoForm.dataInicio}
                                        onChange={(e) => setNovoPeriodoForm({ ...novoPeriodoForm, dataInicio: e.target.value })}
                                        required
                                    />

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Data Fim</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={novoPeriodoForm.dataFim}
                                        onChange={(e) => setNovoPeriodoForm({ ...novoPeriodoForm, dataFim: e.target.value })}
                                        required
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Descrição (Opcional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={novoPeriodoForm.descricao}
                                onChange={(e) => setNovoPeriodoForm({ ...novoPeriodoForm, descricao: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Check
                            type="switch"
                            label="Definir como período ativo"
                            checked={novoPeriodoForm.ativo}
                            onChange={(e) => setNovoPeriodoForm({ ...novoPeriodoForm, ativo: e.target.checked })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="link" onClick={() => setShowNewPeriodModal(false)} className="text-muted">Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={carregando}>
                            {carregando ? <Spinner size="sm" /> : "Criar Período"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div >

    );
}

export default Predefinicoes;