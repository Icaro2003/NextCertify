import { Container, Row, Col, Card, Button, Navbar, Nav, Form, Image, Modal, Badge, Alert } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaCloudUploadAlt, FaCalendarAlt, FaClock, FaDownload, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import LogoNextCertify from '../img/NextCertify.png';

function MeusCertificados() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [usuario, setUsuario] = useState();
    const [certificados, setCertificados] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [tempFileData, setTempFileData] = useState(null);
    const [formData, setFormData] = useState({ titulo: '', periodo: '', horas: '' });

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado) setUsuario(usuarioLogado);
    }, []);

    useEffect(() => {
        if (!usuario) return;
        const listaGlobal = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];
    
        const meusCertificados = listaGlobal.filter(c => String(c.alunoId) === String(usuario.id)).map(c => {
            let statusExibicao = c.status;
            if (c.status === 'pendente') statusExibicao = 'Em espera';
            if (c.status === 'negado') statusExibicao = 'Negado';
            if (c.status === 'aprovado') statusExibicao = 'Aprovado';

            return {
                ...c,
                status: statusExibicao
            };
        });
        setCertificados(meusCertificados);
    }, [usuario]);

    const persist = (listaAtualizada) => {
        if (!usuario) return;
        const listaGlobal = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];
        const listaSemOsMeus = listaGlobal.filter(c => String(c.alunoId) !== String(usuario.id));
        
        const certificadosComInfo = listaAtualizada.map(c => ({
            ...c,
            alunoId: usuario.id,
            alunoNome: usuario.name,
            // Salva de volta para o formato que o sistema espera (minúsculo/pendente)
            status: c.status === 'Em espera' ? 'pendente' : (c.status === 'Negado' ? 'negado' : 'aprovado')
        }));

        const novaListaGlobal = [...listaSemOsMeus, ...certificadosComInfo];
        localStorage.setItem("lista_global_certificados", JSON.stringify(novaListaGlobal));
    };

    const handleFileSelect = () => {
        if (!usuario) return alert('Faça login para enviar arquivos.');
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTempFileData({ name: file.name, data: reader.result });
            setFormData({ titulo: file.name, periodo: '', horas: '' });
            setShowModal(true);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleConfirmUpload = () => {
        if (!formData.periodo || !formData.horas) {
            alert("Por favor, preencha a data e a carga horária.");
            return;
        }

        const novo = {
            id: Date.now(),
            titulo: formData.titulo,
            status: 'Em espera',
            periodo: formData.periodo,
            horas: formData.horas,
            fileName: tempFileData.name,
            fileData: tempFileData.data,
            motivo: '' 
        };

        const updated = [novo, ...certificados];
        setCertificados(updated);
        persist(updated);
        setShowModal(false);
    };

    const handleRemove = (id) => {
        const updated = certificados.filter(c => c.id !== id);
        setCertificados(updated);
        persist(updated);
    };

    const handleDownload = (cert) => {
        if (!cert.fileData) return alert('Arquivo não disponível.');
        const link = document.createElement('a');
        link.href = cert.fileData;
        link.download = cert.fileName || cert.titulo;
        link.click();
    };

    // Função revisada para aceitar variações de texto
    const getBadgeVariant = (status) => {
        const s = status?.toLowerCase();
        if (s === 'aprovado') return 'success';
        if (s === 'negado') return 'danger';
        if (s === 'em espera' || s === 'pendente') return 'warning';
        return 'secondary';
    };

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
                            <Nav.Link href="/aluno" className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link className="mx-2 text-dark fw-bold">Certificados</Nav.Link>
                            <Nav.Link href="/avaliacao-tutoria" className="mx-2 text-dark">Avaliar Tutoria</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario?.name || 'Usuário'}</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <div className="mb-4">
                    <h1 className="text-primary fw-bold mb-3">Meus Certificados</h1>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-4 py-2 fw-medium shadow-sm" onClick={handleFileSelect}>
                        <FaCloudUploadAlt size={22} /> Fazer upload do certificado
                    </Button>
                    <input ref={fileInputRef} type="file" accept="application/pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>

                <div className="d-flex flex-column gap-3">
                    {certificados.map((cert) => (
                        <Card key={cert.id} className={`border-0 rounded-4 shadow-sm overflow-hidden ${cert.status === 'Negado' ? 'border-start border-danger border-5' : ''}`}>
                            <Card.Body className="p-4">
                                <Row className="align-items-center">
                                    <Col lg={8}>
                                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                            <h5 className="text-primary fw-bold mb-0">{cert.titulo}</h5>
                                            <Badge bg={getBadgeVariant(cert.status)} className="px-3 py-2">
                                                {cert.status}
                                            </Badge>
                                        </div>
                                        <div className="d-flex gap-4 text-muted small fw-medium mb-1">
                                            <span><FaCalendarAlt className="me-1 text-primary"/> {cert.periodo}</span>
                                            <span><FaClock className="me-1 text-primary"/> {cert.horas}h</span>
                                        </div>

                                        {/* AQUI APARECE A JUSTIFICATIVA SE ESTIVER NEGADO */}
                                        {cert.status === 'Negado' && (
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                {/* ... (Modal Header, Body, Footer permanecem iguais) */}
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-primary fw-bold">Detalhes do Certificado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">Título / Nome do Curso</Form.Label>
                            <Form.Control type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Data de Conclusão</Form.Label>
                                    <Form.Control type="date" onChange={(e) => setFormData({...formData, periodo: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small">Carga Horária (horas)</Form.Label>
                                    <Form.Control type="number" placeholder="Ex: 40" onChange={(e) => setFormData({...formData, horas: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleConfirmUpload}>Salvar Certificado</Button>
                </Modal.Footer>
            </Modal>

            {/* --- FOOTER --- */}
            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default MeusCertificados;