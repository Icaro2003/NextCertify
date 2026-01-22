import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import mockData from '/src/mocks/relatorio-individual-aluno-mock';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import authMock from '/src/mocks/auth-mock.json';

function RelatorioIndividualAluno() {
    const navigate = useNavigate();
    const { usuario, setUsuario, handleLogout } = useAuthenticatedUser();
    const [ resumo, setResumoHoras ] = useState({ totolAprovado: 0, meta: 100, restante: 100 });

    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { name: "" },
        metricas: [],
        graficos: [],
        experienciaGrafico: [],
        horasCertificado: []
    });

    const [alunos, setAlunos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAlunos, setFilteredAlunos] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    useEffect(() => {
        const usuariosMock = authMock.users || [];
        const usuariosLocal = JSON.parse(localStorage.getItem("usuarios") || "[]");
        const todosUsuarios = [...usuariosMock, ...usuariosLocal];
        const listaAlunos = todosUsuarios.filter(u => u.role === 'aluno');
        setAlunos(listaAlunos);
        const alunoAtual = alunoSelecionado || usuario;
        if (!alunoAtual) return;

        const listaGlobalCertificados = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];
        const meusCertificados = listaGlobalCertificados.filter(c =>
            String(c.alunoId) === String(alunoAtual.id) || String(c.alunoId) === String(alunoAtual.matricula)
        );

        const avaliacoes = JSON.parse(localStorage.getItem("@App:avaliacao") || "[]");
        const minhasAvaliacoes = avaliacoes.filter(a =>
            a.email === alunoAtual.email || a.alunoMatricula === alunoAtual.matricula
        );
        const ultimoEncontro = minhasAvaliacoes[minhasAvaliacoes.length - 1];
        const tutorResponsavel = ultimoEncontro ? ultimoEncontro.tutorNome : "Não atribuído";

        const metricas = [
            { label: "Tutorando", val: alunoAtual.name, icon: "🧑‍🎓" },
            { label: "Curso", val: alunoAtual.curso || "Não informado", icon: "💻" },
            { label: "Tutor Responsável", val: tutorResponsavel, icon: "👩‍🏫" },
            { label: "Encontros Realizados", val: minhasAvaliacoes.length.toString(), icon: "📅" },
            { label: "Certificados", val: meusCertificados.length.toString(), icon: "🏅" },
            { label: "Mantém tutoria?", val: minhasAvaliacoes.length > 0 ? (minhasAvaliacoes[minhasAvaliacoes.length - 1].permanecer === 'sim' ? 'Sim' : 'Não') : 'Não informado', icon: "📚" },
            { label: "Maior dificuldade", val: minhasAvaliacoes.length > 0 ? minhasAvaliacoes[minhasAvaliacoes.length - 1].dificuldade : 'Não informado', icon: "🤯" },
            { label: "Avaliação do Tutor", val: minhasAvaliacoes.length > 0 ? `${Math.round(minhasAvaliacoes.reduce((sum, a) => sum + parseInt(a.avaliacaoTutor || 0), 0) / minhasAvaliacoes.length)}%` : 'Não informado', icon: "🏅" }
        ];

        meusCertificados.forEach(cert => {
            const dataRef = cert.dataEnvio || cert.periodo;
            const dataObj = new Date(dataRef);
            const mes = dataObj.toLocaleString('default', { month: 'short' });
            if (!horasPorMes[mes]) {
                horasPorMes[mes] = { estudos: 0, eventos: 0, monitoria: 0 };
            }
            /*const categoria = cert.titulo.toLowerCase().includes('estudo') ? 'estudos' : cert.titulo.toLowerCase().includes('evento') ? 'eventos' : 'monitoria';
            horasPorMes[mes][categoria] += parseInt(cert.horas) || 0;*/
            const titulo = cert.titulo.toLowerCase();
            const categoriaOriginal = cert.categoria ? cert.categoria.toLowerCase() : "";

            if(categoriaOriginal.includes('estudo') || titulo.includes('estudo')){
                horasPorMes[mes].estudos += parseInt(cert.horas) || 0;
            } else if (categoriaOriginal.includes('evento') || titulo.includes('evento')){
                horasPorMes[mes].eventos += parseInt(cert.horas) || 0;
            } else if (categoriaOriginal.includes('monitoria') || titulo.includes('monitoria')){
                horasPorMes[mes].monitoria += parseInt(cert.horas) || 0;
            }
        });
        
        const listaMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        //const horasCertificado = Object.keys(horasPorMes).length > 0 ? Object.keys(horasPorMes).map(mes => ({ name: mes, ...horasPorMes[mes] })) : mockData.horasCertificado; // Fallback to mock if no data
        const horasCertificadoFinal = Object.values(horasPorMes).sort((a, b) => listaMeses.indexOf(a.name) - listaMeses.indexOf(b.name));
        const experienciaPorMes = {};
        
        minhasAvaliacoes.forEach(av => {
            const mes = new Date(av.data).toLocaleString('default', { month: 'short' });
            if (!experienciaPorMes[mes]) experienciaPorMes[mes] = { boa: 0, ruim: 0 };
            if (parseInt(av.experiencia) > 50) experienciaPorMes[mes].boa++;
            else experienciaPorMes[mes].ruim++;
        });
        const experienciaGrafico = Object.keys(experienciaPorMes).length > 0 ? Object.keys(experienciaPorMes).map(mes => ({ name: mes, ...experienciaPorMes[mes] })) : mockData.experienciaGrafico;

        const encontrosPorMes = {};
        minhasAvaliacoes.forEach(av => {
            const mes = new Date(av.data).toLocaleString('default', { month: 'short' });
            if (!encontrosPorMes[mes]) encontrosPorMes[mes] = { online: 0, presencial: 0 };
            encontrosPorMes[mes].online++;
        });
        const graficos = Object.keys(encontrosPorMes).length > 0 ? Object.keys(encontrosPorMes).map(mes => ({ name: mes, ...encontrosPorMes[mes] })) : mockData.graficos;

        /*setDadosDashboard({
            usuario: { name: alunoAtual.name },
            metricas,
            graficos: graficos.length > 0 ? graficos : mockData.graficos,
            experienciaGrafico: experienciaGrafico.length > 0 ? experienciaGrafico : mockData.experienciaGrafico,
            horasCertificado: horasCertificado.length > 0 ? horasCertificado : mockData.horasCertificado
        });*/

        setDadosDashboard(prev => ({
            ...prev,
            metricas,
            graficos: graficos.length > 0 ? graficos : mockData.graficos,
            experienciaGrafico: experienciaGrafico.length > 0 ? experienciaGrafico : mockData.experienciaGrafico,
            horasCertificado: horasCertificadoFinal.length > 0 ? horasCertificadoFinal : mockData.horasCertificado
        }));

        //setAlunos(authMock.users.filter(u => u.role === 'aluno'));
    }, [usuario, alunoSelecionado]);

    useEffect(() => {
        setFilteredAlunos(alunos.filter(aluno =>
            aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            aluno.matricula.includes(searchTerm)
        ));
    }, [searchTerm, alunos]);

    const downloadCSV = () => {
        const alunoAlvo = alunoSelecionado || usuario;
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        let csv = `--- Relatório Individual do Aluno - NEXTCERTIFY ---\n`;
        csv += `Aluno: ${alunoAlvo.name}\n`;
        csv += `Emitido por: ${usuario.name} (${cargoEmitente})\n`;
        csv += `Data de emissão: ${new Date().toLocaleDateString()}\n\n`;

        csv += "--- Resumo de Desempenho ---\n";
        csv += "Indicador,Valor\n";
        dadosDashboard.metricas.forEach(m => {
            csv += `${m.label},${m.val}\n`;
        });
        csv += "\n";

        csv += "--- Certificados Validos ---\n";
        csv += "Título,Período,Horas,Status\n";
        const listaGlobalCertificados = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];
        const meusCertificados = listaGlobalCertificados.filter(c => String(c.alunoId) === String(alunoAlvo.id));
        meusCertificados.forEach(c => {
            csv += `${c.titulo},${c.periodo},${c.horas},${c.status}\n`;
        });

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio_individual_${alunoAlvo.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    const downloadPDF = async () => {
        const areaGraficos = document.getElementById('area-graficos');
        const alunoAlvo = alunoSelecionado || usuario;
        const doc = new jsPDF();
        const dataAtual = new Date().toLocaleDateString();
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text("Relatório Individual do Aluno - NEXTCERTIFY", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Aluno: ${alunoAlvo.name}`, 14, 28);
        doc.text(`Emitido por: ${usuario.name} (${cargoEmitente})`, 14, 34);
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

        const listaGlobalCertificados = JSON.parse(localStorage.getItem("lista_global_certificados")) || [];
        const meusCertificados = listaGlobalCertificados.filter(c => String(c.alunoId) === String(alunoAlvo.id));

        if (meusCertificados.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text("Histórico de Certificados", 14, 15);
            autoTable(doc, {
                startY: 20,
                head: [['Título', 'Período', 'Horas', 'Status']],
                body: meusCertificados.map(c => [c.titulo, c.periodo, c.horas + "h", c.status]),
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
        doc.save(`relatorio_individual_aluno_Responsavel:${usuario.name}_${alunoAlvo.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const gradientStyle = { background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white' };
    const cardHeaderStyle = { fontSize: '0.85rem', color: '#0056b3', fontWeight: 'bold' };
    const valueStyle = { fontSize: '1.2rem', fontWeight: '500', color: '#555' };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#"><Image src={LogoNextCertify} alt="Logo" height="40" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link onClick={() => navigate(usuario.role === 'coordenador' ? '/coordenador' : '/bolsista')} className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-aluno')} className="mx-2 text-dark">Registro de Alunos</Nav.Link>
                            <Nav.Link onClick={() => navigate('/registro-tutores')} className="mx-2 text-dark">Registro de tutores</Nav.Link>
                            <Nav.Link onClick={() => navigate('/predefinicoes')} className="mx-2 text-dark">Predefinições</Nav.Link>
                            <Nav.Link onClick={() => navigate('/contato')} className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario?.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="flex-grow-1">
                <h2 className="text-primary fw-bold mb-4" style={{ fontSize: '2.5rem' }}>
                    Relatório {alunoSelecionado ? `de ${alunoSelecionado.name}` : 'Aluno'}
                </h2>

                {/* Métricas Superiores */}
                <Row className="g-3 mb-4">
                    {dadosDashboard.metricas.length > 0 ? (
                        dadosDashboard.metricas.map((item, idx) => (
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
                        ))
                    ) : (
                        <Col><p className="text-muted">Nenhuma métrica encontrada no sistema.</p></Col>
                    )}
                </Row>

                {/* Gráficos */}
                <Row className="mb-4 g-4" id="area-graficos">
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

                {/* Tabela e Lista de Dificuldades */}
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
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="estudos" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="eventos" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="monitoria" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col md={6}>
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
                                                    <strong>{aluno.name}</strong> - {aluno.matricula}
                                                </div>
                                                <Button variant="outline-primary" size="sm" onClick={() => setAlunoSelecionado(aluno)}>
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
                    </Col>

                </Row>

                <div className="d-flex gap-3 mb-5">
                    <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#1a56db' }} onClick={downloadPDF}>
                        <FaFilePdf /> Baixar PDF
                    </Button>
                    <Button variant="info" className="px-5 py-2 fw-bold text-white d-flex align-items-center gap-2 border-0" style={{ backgroundColor: '#06b6d4' }} onClick={downloadCSV}>
                        <FaFileCsv /> Baixar CSV
                    </Button>
                </div>
            </Container>
            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container><h5 className="mb-0">© 2025 - NextCertify</h5></Container>
            </footer>
        </div>
    );
}

export default RelatorioIndividualAluno;