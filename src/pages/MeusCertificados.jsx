import { Container, Row, Col, Card, Button, Navbar, Nav, Form, Image, Modal, Badge, Alert } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaCloudUploadAlt, FaCalendarAlt, FaClock, FaDownload, FaTrash, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import useAlert from '../hooks/useAlert';
import AlertBox from '../components/AlertBox';

import LogoNextCertify from '../img/NextCertify.png';

function MeusCertificados() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { usuario, token, handleLogout } = useAuthenticatedUser();
    const { show, message, variant, alertKey, handleAlert } = useAlert();

    const [certificados, setCertificados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    // const [showModal, setShowModal] = useState(false);
    // const [fileToUpload, setFileToUpload] = useState(null);
    // const [formData, setFormData] = useState({ titulo: '', periodo: '', horas: '' });

    useEffect(() => {
        if (!usuario || !token) return;

        if (usuario.role !== 'student') {
            alert("Acesso negado. Esta página é exclusiva para alunos.");
            navigate('/');
        }

        const carregarCertificados = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/certificates/user/${usuario.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok && data.certificates) {
                    console.log("DADOS RECEBIDOS DO BACKEND:", data.certificates);
                    const certificates = data.certificates.map(c => {
                        const sDate = c.startDate || c.dataInicio;
                        const eDate = c.endDate || c.dataFim;
                        const start = sDate ? new Date(sDate) : new Date();
                        const end = eDate ? new Date(eDate) : new Date();
                        const periodo = `${start.getMonth() + 1}/${start.getFullYear()} - ${end.getMonth() + 1}/${end.getFullYear()}`;

                        return {
                            ...c,
                            titulo: c.title || c.titulo || "Certificado",
                            horas: c.workload !== undefined ? c.workload : (c.cargaHoraria !== undefined ? c.cargaHoraria : '--'),
                            periodo: periodo,
                            statusExibicao: c.status === 'pending' ? 'Em espera' : (c.status === 'rejected' ? 'Negado' : 'Aprovado'),
                            motivo: c.adminComments || c.comentariosAdmin
                        };
                    });
                    setCertificados(certificates);
                }
            } catch (error) {
                console.error("Erro ao buscar certificados:", error);
            }
        };

        carregarCertificados();
    }, [usuario, token]);

    const handleFileSelect = () => {
        if (carregando) {
            return;
        }

        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCarregando(true);

        try {
            const data = new FormData();
            data.append('certificate', file);

            const response = await fetch('http://localhost:3000/api/certificates/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const novoCert = await response.json();

            if (response.ok) {
                console.log("CERTIFICADO UPLOADED:", novoCert);
                const sDate = novoCert.startDate || novoCert.dataInicio;
                const eDate = novoCert.endDate || novoCert.dataFim;
                const start = sDate ? new Date(sDate) : new Date();
                const end = eDate ? new Date(eDate) : new Date();
                const periodo = `${start.getMonth() + 1}/${start.getFullYear()} - ${end.getMonth() + 1}/${end.getFullYear()}`;

                const certMapeado = {
                    ...novoCert,
                    titulo: novoCert.title || novoCert.titulo || "Certificado",
                    horas: novoCert.workload !== undefined ? novoCert.workload : (novoCert.cargaHoraria !== undefined ? novoCert.cargaHoraria : '--'),
                    periodo: periodo,
                    statusExibicao: 'Em espera'
                };

                setCertificados([certMapeado, ...certificados]);
                alert("Certificado enviado com sucesso!");
                // setShowModal(false);
            } else {
                handleAlert(novoCert.error || "Erro ao enviar certificado.");
            }
        } catch (error) {
            console.error("Erro no upload:", error);
        } finally {
            setCarregando(false);
            e.target.value = null;
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Deseja realmente excluir este certificado?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/certificates/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setCertificados(certificados.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    const handleDownload = async (cert) => {
        try {
            const response = await fetch(`http://localhost:3000/api/certificates/${cert.id}/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = cert.titulo || "certificado.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (error) {
            console.error("Erro no download:", error);
        }
    };

    const getBadgeVariant = (status) => {
        const s = status?.toLowerCase();
        if (s === 'aprovado' || s === 'approved') return 'success';
        if (s === 'negado' || s === 'rejected') return 'danger';
        if (s === 'em espera' || s === 'pending') return 'warning';
        return 'secondary';
    };

    if (!usuario) {
        return null;
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand onClick={() => navigate('/aluno')} style={{ cursor: 'pointer' }}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link onClick={() => navigate('/aluno')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Home</Nav.Link>
                            <Nav.Link className="mx-2 text-dark fw-bold">Certificados</Nav.Link>
                            <Nav.Link onClick={() => navigate('/avaliacao-tutoria')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Avaliar Tutoria</Nav.Link>
                            <Nav.Link onClick={() => navigate('/contato')} className="mx-2 text-dark" style={{ cursor: 'pointer' }}>Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.nome || 'Usuário'}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <div className="mb-4">
                    <h1 className="text-primary fw-bold mb-3">Meus Certificados</h1>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-4 py-2 fw-medium shadow-sm" disabled={carregando} onClick={handleFileSelect}>
                        <FaCloudUploadAlt size={22} />
                        {carregando ? 'Processando PDF...' : `Fazer upload do certificado`}
                    </Button>
                    <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>

                <AlertBox
                    show={show}
                    message={message}
                    variant={variant}
                    key={alertKey}
                />

                <div className="d-flex flex-column gap-3">
                    {certificados.map((cert) => (
                        <Card key={cert.id} className={`border-0 rounded-4 shadow-sm overflow-hidden ${cert.status === 'rejected' ? 'border-start border-danger border-5' : ''}`}>
                            <Card.Body className="p-4">
                                <Row className="align-items-center">
                                    <Col lg={8}>
                                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                            <h5 className="text-primary fw-bold mb-0">{cert.titulo || "SEM_TITULO"}</h5>
                                            <Badge bg={getBadgeVariant(cert.status)} className="px-3 py-2">
                                                {cert.statusExibicao || cert.status}
                                            </Badge>
                                        </div>
                                        <div className="d-flex gap-4 text-muted small fw-medium mb-1">
                                            <span><FaCalendarAlt className="me-1 text-primary" /> {cert.periodo || '---'}</span>
                                            <span><FaClock className="me-1 text-primary" /> {cert.horas || '--'}h</span>
                                        </div>

                                        {cert.status === 'rejected' && (
                                            <Alert variant="danger" className="mt-3 py-2 px-3 d-flex align-items-start gap-2 border-0 shadow-sm">
                                                <FaExclamationTriangle className="mt-1" />
                                                <div>
                                                    <strong className="d-block">Certificado Indeferido:</strong>
                                                    {cert.motivo || "Nenhuma justificativa fornecida pelo avaliador."}
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
            </Container>

            {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-primary fw-bold">Detalhes do Certificado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">Título / Nome do Curso</Form.Label>
                            <Form.Control type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Data de Conclusão</Form.Label>
                                    <Form.Control type="date" value={formData.periodo} onChange={(e) => setFormData({ ...formData, periodo: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Carga Horária (horas)</Form.Label>
                                    <Form.Control type="number" value={formData.horas} placeholder="Ex: 40" onChange={(e) => setFormData({ ...formData, horas: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleConfirmUpload} disabled={carregando}>
                        {carregando ? 'Enviando...' : 'Salvar Certificado'}
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default MeusCertificados;