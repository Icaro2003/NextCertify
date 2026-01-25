import { Container, Row, Col, Card, Button, Navbar, Nav, Form, Image, Modal, Badge, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaCloudUploadAlt, FaCalendarAlt, FaClock, FaDownload, FaTrash, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import certificateService from '../services/certificateService';
import predefinicoesService from '../services/predefinicoesService';

function MeusCertificados() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { usuario, token, handleLogout } = useAuthenticatedUser();
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [tempFile, setTempFile] = useState(null);
    const [formData, setFormData] = useState({ titulo: '', startDate: '', endDate: '', horas: '', categoria: '', instituicao: '', descricao: '' });

    const [resumoHoras, setResumoHoras] = useState({ aprovadas: 0, meta: 100, faltam: 100, progresso: 0 });

    useEffect(() => {
        if (!usuario || !token) return;

        const carregarDados = async () => {
            try {
                setLoading(true);
                const certificadosData = await certificateService.listCertificates(usuario.id, token);

                const formatados = certificadosData.map(c => ({
                    ...c,
                    statusDisplay: c.status === 'approved' ? 'Aprovado' : (c.status === 'rejected' ? 'Negado' : 'Em espera'),
                    periodo: `${new Date(c.startDate).toLocaleDateString()} - ${new Date(c.endDate).toLocaleDateString()}`
                }));

                const horasAprovadas = certificadosData.filter(c => c.status === 'approved').reduce((acc, curr) => acc + (Number(curr.workload) || 0), 0);

                let meta = 100; // Valor padrão se não encontrar vínculo

                try {
                    const vinculos = await predefinicoesService.listVinculos(null, token);
                    const meuVinculo = vinculos.find(v =>
                        (usuario.bolsista && v.bolsistaId === usuario.bolsista.id) ||
                        v.usuarioId === usuario.id
                    );

                    if (meuVinculo) {
                        const cargas = await predefinicoesService.listCargasHorarias(meuVinculo.periodoId, token);
                        if (cargas.length > 0) {
                            const totalMeta = cargas.reduce((acc, curr) => acc + (Number(curr.horasMinimas) || 0), 0);
                            if (totalMeta > 0) meta = totalMeta;
                        }
                    } else {
                        console.warn("Nenhum vínculo de tutoria encontrado para este bolsista.");
                    }
                } catch (preError) {
                    console.error("Erro ao carregar meta dinâmica:", preError);
                }


                setCertificados(formatados);
                setResumoHoras({
                    aprovadas: horasAprovadas,
                    meta: meta,
                    faltam: Math.max(0, meta - horasAprovadas),
                    progresso: Math.min(100, (horasAprovadas / meta) * 100)
                });
                setError(null);

            } catch (err) {
                setError("Erro ao carregar dados do servidor.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [usuario, token]);

    const handleFileSelect = () => {
        if (!usuario) return alert('Faça login para enviar arquivos.');
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setTempFile(file);
        setFormData({
            titulo: file.name.replace(/\.[^/.]+$/, ""),
            startDate: '',
            endDate: '',
            horas: '',
            categoria: 'EVENTOS',
            instituicao: '',
            descricao: ''
        });

        setShowModal(true);
        e.target.value = null;
    };

    const handleConfirmUpload = async () => {
        if (!formData.categoria) {
            alert("Por favor, selecione a categoria do certificado.");
            return;
        }


        try {
            const uploadData = new FormData();
            uploadData.append('file', tempFile);
            uploadData.append('title', formData.titulo);
            uploadData.append('description', formData.descricao);
            uploadData.append('institution', formData.instituicao);
            uploadData.append('workload', formData.horas);
            uploadData.append('startDate', formData.startDate);
            uploadData.append('endDate', formData.endDate);
            uploadData.append('category', formData.categoria);

            await certificateService.uploadCertificate(uploadData, token);

            // Recarregar lista
            const data = await certificateService.listCertificates(usuario.id, token);
            const formatados = data.map(c => ({
                ...c,
                statusDisplay: c.status === 'approved' ? 'Aprovado' : (c.status === 'rejected' ? 'Negado' : 'Em espera'),
                periodo: `${new Date(c.startDate).toLocaleDateString()} - ${new Date(c.endDate).toLocaleDateString()}`
            }));
            setCertificados(formatados);

            setShowModal(false);
            alert("Certificado enviado com sucesso!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este certificado?")) return;

        try {
            await certificateService.deleteCertificate(id, token);
            setCertificados(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Erro ao excluir certificado.");
        }
    };

    const handleDownload = async (cert) => {
        try {
            await certificateService.downloadCertificate(cert.id, token);
        } catch (err) {
            alert(err.message);
        }
    };

    const getBadgeVariant = (status) => {
        if (status === 'approved') return 'success';
        if (status === 'rejected') return 'danger';
        return 'warning';
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <Image src={LogoNextCertify} alt="Logo NextCertify" height="40" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link onClick={() => navigate('/bolsista')} className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link className="mx-2 text-dark fw-bold">Certificados</Nav.Link>
                            <Nav.Link onClick={() => navigate('/avaliacao-tutoria')} className="mx-2 text-dark">Avaliação Tutoria</Nav.Link>
                        </Nav>

                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario?.nome}</span>
                            </div>
                            <Button variant="outline-danger" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                    <Card.Body className="p-4">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <h4 className="fw-bold text-primary mb-1">Meu Progresso</h4>
                                <p className="text-muted small">Acompanhe suas horas complementares aprovadas</p>
                                <div className="d-flex align-items-baseline gap-2 mt-3">
                                    <h2 className="fw-bold mb-0 text-success">{resumoHoras.aprovadas}h</h2>
                                    <span className="text-muted fw-medium">de {resumoHoras.meta}h necessárias</span>
                                </div>
                            </Col>
                            <Col md={6} className="text-md-end mt-3 mt-md-0">
                                <div className="mb-2 fw-bold text-dark">
                                    {resumoHoras.faltam > 0
                                        ? `Faltam cumprir: ${resumoHoras.faltam} horas`
                                        : "Meta atingida! Parabéns! 🎉"}
                                </div>
                                <ProgressBar
                                    now={resumoHoras.progresso}
                                    variant={resumoHoras.progresso === 100 ? "success" : "primary"}
                                    className="rounded-pill shadow-sm"
                                    style={{ height: '12px' }}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <div className="mb-4">
                    <h1 className="text-primary fw-bold mb-3">Meus Certificados</h1>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-4 py-2 fw-medium shadow-sm" onClick={handleFileSelect}>
                        <FaCloudUploadAlt size={22} /> Fazer upload do certificado
                    </Button>
                    <input ref={fileInputRef} type="file" accept="application/pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Carregando seus certificados...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {certificados.map((cert) => (
                            <Card key={cert.id} className={`border-0 rounded-4 shadow-sm overflow-hidden ${cert.status === 'rejected' ? 'border-start border-danger border-5' : ''}`}>
                                <Card.Body className="p-4">
                                    <Row className="align-items-center">
                                        <Col lg={8}>
                                            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                                <h5 className="text-primary fw-bold mb-0">{cert.title}</h5>
                                                <Badge bg="info" className="px-2 py-1 text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                                    {cert.category || 'Geral'}
                                                </Badge>
                                                <Badge bg={getBadgeVariant(cert.status)} className="px-3 py-2">
                                                    {cert.statusDisplay}
                                                </Badge>
                                            </div>
                                            <div className="d-flex gap-4 text-muted small fw-medium mb-1">
                                                <span><FaCalendarAlt className="me-1 text-primary" /> {cert.periodo}</span>
                                                <span><FaClock className="me-1 text-primary" /> {cert.workload}h</span>
                                            </div>
                                            {cert.status === 'rejected' && (
                                                <Alert variant="danger" className="mt-3 py-2 px-3 d-flex align-items-start gap-2 border-0 shadow-sm">
                                                    <FaExclamationTriangle className="mt-1" />
                                                    <div>
                                                        <strong className="d-block">Certificado Indeferido:</strong>
                                                        {cert.adminComments || "Nenhuma justificativa fornecida pelo avaliador."}
                                                    </div>
                                                </Alert>
                                            )}
                                        </Col>
                                        <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                                            <Button variant="outline-secondary" className="me-2 border-0" onClick={() => handleDownload(cert)}>
                                                <FaDownload /> Download
                                            </Button>
                                            <Button variant="outline-danger" className="border-0" onClick={() => handleRemove(cert.id)}>
                                                <FaTrash /> Excluir
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                        {certificados.length === 0 && <p className="text-center text-muted mt-5">Nenhum certificado enviado ainda.</p>}
                    </div>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-primary fw-bold">Detalhes do Certificado</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">Título / Nome do Curso (Opcional)</Form.Label>
                            <Form.Control type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">Categoria Certificado</Form.Label>
                            <Form.Select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}>
                                <option value="EVENTOS">Eventos</option>
                                <option value="MONITORIA">Monitoria</option>
                                <option value="ESTUDOS_INDIVIDUAIS">Estudos Individuais</option>
                            </Form.Select>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Data de Início (Opcional)</Form.Label>
                                    <Form.Control type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Data de Término (Opcional)</Form.Label>
                                    <Form.Control type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Carga Horária (horas) (Opcional)</Form.Label>
                                    <Form.Control type="number" placeholder="Ex: 40" value={formData.horas} onChange={(e) => setFormData({ ...formData, horas: e.target.value })} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Instituição (Opcional)</Form.Label>
                                    <Form.Control type="text" value={formData.instituicao} onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">Descrição (Opcional)</Form.Label>
                            <Form.Control as="textarea" rows={2} value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleConfirmUpload}>Salvar Certificado</Button>
                </Modal.Footer>
            </Modal>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default MeusCertificados;