import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import relatorioService from '../services/relatorioService';
import predefinicoesService from '../services/predefinicoesService';

function RelatorioIndividualAluno() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, token, handleLogout } = useAuthenticatedUser();
    const [expanded, setExpanded] = useState(false);

    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { nome: "", matricula: "", curso: "" },
        metricas: [],
        graficos: [],
        experienciaGrafico: [],
        horasCertificado: [],
        certificados: []
    });

    const [alunos, setAlunos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAlunos, setFilteredAlunos] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;
        carregarAlunos();

        if (location.state?.id) {
            setAlunoSelecionado({ id: location.state.id });
        }
    }, [token, location.state]);


    useEffect(() => {
        if (!token || !usuario) return;

        if ((usuario.role === 'coordinator' || usuario.role === 'coordenador') && !alunoSelecionado) {
            return;
        }

        const idParaCarregar = alunoSelecionado ? (alunoSelecionado.id || alunoSelecionado.matricula) : (usuario.aluno?.id || usuario.id);
        if (idParaCarregar) {
            carregarDadosDashboard(idParaCarregar);
        }
    }, [token, usuario, alunoSelecionado]);


    useEffect(() => {
        setFilteredAlunos(alunos.filter(aluno =>
            aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [searchTerm, alunos]);

    const carregarAlunos = async () => {
        try {
            const bolsistas = await predefinicoesService.listScholarshipHolders(token);
            const formatados = bolsistas.map(b => ({
                id: b.id,
                nome: b.nome || "Sem nome",
                matricula: b.id.slice(0, 8)
            }));


            setAlunos(formatados);
        } catch (err) {
            console.error("Erro ao carregar lista de alunos:", err);
        }
    };

    const carregarDadosDashboard = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await relatorioService.getRelatorioIndividualAluno(id, token);
            setDadosDashboard(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        const alunoAlvo = dadosDashboard.usuario;
        const cargoEmitente = usuario?.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        const csv = `--- Relatório Individual do Aluno - NEXTCERTIFY ---\n` +
            `Aluno: ${alunoAlvo.nome}\n` +
            `Emitido por: ${usuario?.nome} (${cargoEmitente})\n` +
            `Data de emissão: ${new Date().toLocaleDateString()}\n\n` +
            `--- Resumo de Desempenho ---\n` +
            `Indicador,Valor\n` +
            dadosDashboard.metricas.map(m => `"${m.label}","${m.val}"`).join('\n') +
            `\n\n--- Histórico de Certificados ---\n` +
            `Título,Período,Horas,Status\n` +
            dadosDashboard.certificados.map(c => `"${c.titulo}","${c.periodo}","${c.horas}","${c.status}"`).join('\n');

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio_individual_${alunoAlvo.nome.replace(/\s+/g, '_').toLowerCase()}.csv`;
        link.click();
    };

    const downloadPDF = async () => {
        const areaGraficos = document.getElementById('area-graficos');
        const alunoAlvo = dadosDashboard.usuario;
        const doc = new jsPDF();
        const dataAtual = new Date().toLocaleDateString();
        const cargoEmitente = usuario?.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text("Relatório Individual do Aluno - NEXTCERTIFY", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Aluno: ${alunoAlvo.nome}`, 14, 28);
        doc.text(`Emitido por: ${usuario?.nome} (${cargoEmitente})`, 14, 34);
        doc.text(`Data de emissão: ${dataAtual}`, 14, 40);

        autoTable(doc, {
            startY: 46,
            head: [['Indicador', 'Valor']],
            body: dadosDashboard.metricas.map(m => [m.label, m.val]),
            headStyles: { fillColor: [26, 86, 219] },
        });

        if (areaGraficos) {
            try {
                const canvas = await html2canvas(areaGraficos, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                doc.addPage();
                doc.setFontSize(16);
                doc.setTextColor(0);
                doc.text("Análise Evolutiva e Engajamento", 14, 15);
                doc.addImage(imgData, 'PNG', 10, 25, 160, 90);
            } catch (e) {
                console.error("Falha ao capturar gráficos:", e);
            }
        }

        const certificados = dadosDashboard.certificados || [];
        if (certificados.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text("Histórico de Certificados", 14, 15);
            autoTable(doc, {
                startY: 20,
                head: [['Título', 'Período', 'Horas', 'Status']],
                body: certificados.map(c => [c.titulo, c.periodo, c.horas + "h", c.status]),
                headStyles: { fillColor: [99, 102, 219] },
            });
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - NextCertify © 2026`, 14, doc.internal.pageSize.height - 10);
        }
        doc.save(`relatorio_individual_aluno_${alunoAlvo.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const cardHeaderStyle = { fontSize: '0.85rem', color: '#0056b3', fontWeight: 'bold' };
    const valueStyle = { fontSize: '1.2rem', fontWeight: '500', color: '#555' };
    const gradientStyle = { background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white' };

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
                            <Nav.Link onClick={() => navigate('/predefinicoes')} className="mx-2 text-dark">Predefinições</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-tutor')} className="mx-2 text-dark">Relatório Tutor</Nav.Link>
                            <Nav.Link onClick={() => navigate('/relatorio-individual-aluno')} className="mx-2 text-dark fw-bold">Relatório Aluno</Nav.Link>
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

            <Container className="flex-grow-1 p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold m-0" style={{ fontSize: '2.5rem' }}>
                        Relatório {dadosDashboard.usuario.nome ? `de ${dadosDashboard.usuario.nome}` : 'Aluno'}
                    </h2>

                    <div style={{ minWidth: '250px' }}>
                        <Form.Group>
                            <Form.Label className="small fw-bold text-muted text-uppercase">Selecionar Aluno</Form.Label>
                            <Form.Select
                                value={alunoSelecionado?.id || ""}
                                onChange={(e) => {
                                    const aluno = alunos.find(a => a.id === e.target.value);
                                    setAlunoSelecionado(aluno || null);
                                }}
                                className="shadow-sm border-primary"
                            >
                                <option value="">Escolha um aluno...</option>
                                {alunos.map((aluno, idx) => (
                                    <option key={idx} value={aluno.id}>{aluno.nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>


                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Carregando dados do relatório...</p>
                    </div>
                ) : (!alunoSelecionado && (usuario?.role === 'coordinator' || usuario?.role === 'coordenador')) ? (
                    <div className="alert alert-info shadow-sm border-0">
                        Selecione um aluno para visualizar os dados de acompanhamento.
                    </div>
                ) : (
                    <>

                        <Row className="g-3 mb-4">
                            {dadosDashboard.metricas.map((item, idx) => (
                                <Col key={idx} md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div style={cardHeaderStyle}>{item.label}</div>
                                                <div style={valueStyle}>{item.val}</div>
                                            </div>
                                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div id="area-graficos">
                            <Row className="mb-4 g-4">
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-bold text-dark">Encontros Realizados</h6>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={dadosDashboard.graficos}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="online" stroke="#00c6fb" strokeWidth={3} dot={false} />
                                                <Line type="monotone" dataKey="presencial" stroke="#005bea" strokeWidth={3} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-bold text-dark">Experiência da Tutoria</h6>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={dadosDashboard.experienciaGrafico}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="boa" stroke="#28a745" strokeWidth={3} dot={false} />
                                                <Line type="monotone" dataKey="ruim" stroke="#dc3545" strokeWidth={3} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="mb-5 g-4">
                                <Col md={6}>
                                    <Card className="border-0 shadow-sm p-3 h-100">
                                        <div className="d-flex justify-content-between align-content-center mb-3">
                                            <h6 className="fw-bold text-dark mb-0">Horas por Certificado</h6>
                                            <div className="d-flex gap-2" style={{ fontSize: '0.7rem' }}>
                                                <span style={{ color: '#2563eb' }}>● Estudos</span>
                                                <span style={{ color: '#06b6d4' }}>● Eventos</span>
                                                <span style={{ color: '#6366f1' }}>● Monitoria</span>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={dadosDashboard.horasCertificado}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Line type="monotone" dataKey="estudos" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="eventos" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="monitoria" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                                {/* <Col md={6}>
                                    <Card className="border-0 shadow-sm p-3 h-100">
                                        <h6 className="fw-bold text-dark">Pesquisar Alunos Cadastrados</h6>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="Buscar por nome ou matrícula"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredAlunos.length > 0 ? (
                                                <ListGroup variant="flush">
                                                    {filteredAlunos.map(aluno => (
                                                        <ListGroup.Item key={aluno.id} className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{aluno.nome}</strong> - {aluno.matricula}
                                                            </div>
                                                            <Button variant="outline-primary" size="sm" onClick={() => {
                                                                setAlunoSelecionado(aluno);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}>
                                                                <FaSearch /> Ver Relatório
                                                            </Button>

                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            ) : (
                                                <p className="text-muted">Nenhum aluno encontrado.</p>
                                            )}
                                        </div>
                                    </Card>
                                </Col> */}
                            </Row>
                        </div>

                        <div className="d-flex gap-3 mb-5">
                            <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#1a56db' }} onClick={downloadPDF}>
                                <FaFilePdf /> Baixar PDF
                            </Button>
                            <Button variant="info" className="px-5 py-2 fw-bold text-white d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#06b6d4' }} onClick={downloadCSV}>
                                <FaFileCsv /> Baixar CSV
                            </Button>
                        </div>
                    </>
                )}
            </Container>
            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container><h5 className="mb-0">© 2025 - NextCertify</h5></Container>
            </footer>
        </div>
    );
}

export default RelatorioIndividualAluno;