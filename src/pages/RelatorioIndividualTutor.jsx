import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import relatorioService from '../services/relatorioService';
import predefinicoesService from '../services/predefinicoesService';

function RelatorioIndividualTutor() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, token, handleLogout } = useAuthenticatedUser();
    const [tutorSelecionado, setTutorSelecionado] = useState("");

    const [listaTutores, setListaTutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { nome: "", matricula: "", curso: "" },
        metricas: [],
        graficos: [],
        tutorandos: [],
        dificuldadesGrafico: []
    });

    useEffect(() => {
        if (!token) return;
        carregarTutores();

        if (location.state?.id) {
            setTutorSelecionado(location.state.id);
        }
    }, [token, location.state]);


    useEffect(() => {
        if (!token) return;
        const idParaCarregar = tutorSelecionado || (usuario?.role === 'tutor' ? (usuario.tutor?.id || usuario.id) : "");
        if (idParaCarregar) {
            carregarDadosDashboard(idParaCarregar);
        }
    }, [token, tutorSelecionado, usuario]);

    const carregarTutores = async () => {
        try {
            const tutores = await predefinicoesService.listTutors(token);
            setListaTutores(tutores.map(t => ({
                id: t.id,
                nome: t?.nome || "Sem nome"
            })));
        } catch (err) {
            console.error("Erro ao carregar tutores:", err);
        }
    };

    const carregarDadosDashboard = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await relatorioService.getRelatorioIndividualTutor(id, token);
            setDadosDashboard(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const downloadCSV = () => {
        const tutor = dadosDashboard.usuario;
        const cargoEmitente = usuario?.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        const csv = `--- Relatório Individual do Tutor - NextCertify ---\n` +
            `Tutor: ${tutor.nome}\n` +
            `Emitido por: ${usuario?.nome} (${cargoEmitente})\n` +
            `Data: ${new Date().toLocaleDateString()}\n\n` +
            `--- Resumo de Desempenho ---\n` +
            `Indicador,Valor\n` +
            dadosDashboard.metricas.map(m => `"${m.label}","${m.val}"`).join('\n') +
            `\n\n--- Histórico de Atendimento ---\n` +
            `Nome do Aluno,Encontros Totais,Semestre\n` +
            dadosDashboard.tutorandos.map(t => `"${t.nome}","${t.encontros}","${t.semestre}"`).join('\n');

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio_individual_tutor_${tutor.nome.replace(/\s+/g, '_').toLowerCase()}.csv`;
        link.click();
    };

    const downloadPDF = async () => {
        const areaGraficos = document.getElementById("area-graficos-tutor");
        const tutor = dadosDashboard.usuario;
        const doc = new jsPDF();
        const dataAtual = new Date().toLocaleDateString();
        const cargoEmitente = usuario?.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text("Relatório Individual do Tutor - NEXTCERTIFY", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Tutor: ${tutor.nome}`, 14, 28);
        doc.text(`Emitido por: ${usuario?.nome} (${cargoEmitente})`, 14, 34);
        doc.text(`Data de Emissão: ${dataAtual}`, 14, 40);

        autoTable(doc, {
            startY: 46,
            head: [['Indicador', 'Valor']],
            body: dadosDashboard.metricas.map(m => [m.label, m.val]),
            headStyles: { fillColor: [26, 86, 219] },
        });

        if (areaGraficos) {
            try {
                const canvas = await html2canvas(areaGraficos, { scale: 2, useCORS: true, logging: false });
                const imgData = canvas.toDataURL('image/png');
                const finalYMetricas = doc.lastAutoTable.finalY;
                const currentY = finalYMetricas > 150 ? 20 : finalYMetricas + 15;
                if (finalYMetricas > 150) doc.addPage();

                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Análise Visual dos encontros", 14, currentY);
                doc.addImage(imgData, 'PNG', 10, currentY + 5, 190, 80);
            } catch (e) {
                console.error("Erro ao capturar gráficos para PDF:", e);
            }
        }

        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(26, 86, 219);
        doc.text("Histórico de atendimentos", 14, 15);

        autoTable(doc, {
            startY: 20,
            head: [['Nome do Aluno', 'Encontros Totais', 'Semestre']],
            body: dadosDashboard.tutorandos.map(t => [t.nome, t.encontros, t.semestre]),
            headStyles: { fillColor: [99, 102, 219] },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - NextCertify © 2026`, 14, doc.internal.pageSize.height - 10);
        }
        doc.save(`relatorio_individual_tutor_${tutor.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

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
                            <Nav.Link onClick={() => navigate('/relatorio-individual-tutor')} className="mx-2 text-dark fw-bold">Relatório Tutor</Nav.Link>
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

            <Container className="flex-grow-1 p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold m-0" style={{ fontSize: '2.2rem' }}>Relatório por Tutor</h2>

                    <div style={{ minWidth: '250px' }}>
                        <Form.Group>
                            <Form.Label className="small fw-bold text-muted text-uppercase">Selecionar Tutor</Form.Label>
                            <Form.Select
                                value={tutorSelecionado}
                                onChange={(e) => setTutorSelecionado(e.target.value)}
                                className="shadow-sm border-primary"
                            >
                                <option value="">Escolha um tutor...</option>
                                {listaTutores.map((t, idx) => (
                                    <option key={idx} value={t.id}>{t.nome}</option>
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
                ) : !tutorSelecionado && usuario?.role !== 'tutor' ? (
                    <div className="alert alert-info shadow-sm border-0">
                        Selecione um tutor para visualizar os dados de atendimento.
                    </div>
                ) : (
                    <>

                        {/* Métricas Superiores */}
                        <Row className="g-3 mb-4">
                            {dadosDashboard.metricas.map((item, idx) => (
                                <Col key={idx} md={3}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div style={{ fontSize: '0.85rem', color: '#0056b3', fontWeight: 'bold' }}>{item.label}</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: '500', color: '#555' }}>{item.val}</div>
                                            </div>
                                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Gráficos */}
                        <Row className="mb-4 g-4" id="area-graficos-tutor">
                            <Col md={6}>
                                <Card className="border-0 shadow-sm p-3 h-100">
                                    <h6 className="fw-bold text-dark">Evolução de Encontros (Virtuais vs Presenciais)</h6>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={dadosDashboard.graficos}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Line name="Online" type="monotone" dataKey="online" stroke="#00c6fb" strokeWidth={3} dot={true} />
                                            <Line name="Presencial" type="monotone" dataKey="presencial" stroke="#005bea" strokeWidth={3} dot={true} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card className="border-0 shadow-sm p-3 h-100">
                                    <h6 className="fw-bold text-dark">Frequência de Dificuldades</h6>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={dadosDashboard.dificuldadesGrafico}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar name="Sim" dataKey="sim" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                            <Bar name="Não" dataKey="nao" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        {/* Tabela de Tutorandos */}
                        <Row className="mb-5 g-4">
                            <Col md={12}>
                                <Card className="border-0 shadow-sm p-3 mb-4">
                                    <h6 className="fw-bold mb-3">Histórico de Atendimento: {dadosDashboard.usuario.nome}</h6>
                                    <Table hover responsive borderless size="sm" className="text-muted">
                                        <thead className="border-bottom">
                                            <tr><th>Nome do Aluno</th><th>Encontros Totais</th><th>Semestre</th></tr>
                                        </thead>
                                        <tbody>
                                            {dadosDashboard.tutorandos.map((tuto, i) => (
                                                <tr key={i}>
                                                    <td>{tuto.nome}</td>
                                                    <td>{tuto.encontros}</td>
                                                    <td>{tuto.semestre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Col>
                        </Row>

                        <div className="d-flex gap-3 mb-5">
                            <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#1a56db' }} onClick={downloadPDF}>
                                <FaFilePdf /> Baixar PDF do Tutor
                            </Button>
                            <Button variant="info" className="px-5 py-2 fw-bold text-white d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#06b6d4' }} onClick={downloadCSV}>
                                <FaFileCsv /> Baixar CSV
                            </Button>
                        </div>
                    </>
                )}
            </Container>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white', padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container><h5 className="mb-0">© 2025 - NextCertify</h5></Container>
            </footer>
        </div>
    );
}

export default RelatorioIndividualTutor;