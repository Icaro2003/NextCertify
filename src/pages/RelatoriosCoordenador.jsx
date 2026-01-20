import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import mockData from '/src/mocks/relatorio-mock.json';
import mockAut from '../mocks/auth-mock.json';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

function RelatoriosCoordenador() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);


    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { name: "" },
        metricas: [],
        graficos: [],
        horasCertificado: [],
        dificuldadesGrafico: [],
        tutores: [],
        tutorandos: [],
        dificuldades: []
    });

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuarioLogado) {
            setUsuario(usuarioLogado);
        } else {
            navigate('/');
        }

        //const baseDados = { ...mockData };
        //const relatoriosTutores = JSON.parse(localStorage.getItem("relatorios_cadastrados") || "[]");
        //const certificadosGlobais = JSON.parse(localStorage.getItem("lista_global_certificados") || "[]");
        const relatoriosReais = JSON.parse(localStorage.getItem("relatorios_cadastrados") || "[]");
        const certificadosGlobais = JSON.parse(localStorage.getItem("lista_global_certificados") || "[]");
        const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios") || "[]");

        const listaUsuarios = [
            ...(Array.isArray(mockAut) ? mockAut : (mockAut.users || [])),
            ...usuariosCadastrados
        ];

        const listaTutoresMock = listaUsuarios.filter(user => user.role === 'tutor').map(t => ({
            id: t.matricula || "TUT-OFF",
            nome: t.name,
            encontros: relatoriosReais.filter(r => r.tutorNome === t.name).length,
            semestre: t.semestre || "2025.1"
        }));

        // Filtra Alunos (Tutorandos) do Mock
        const listaAlunosMock = listaUsuarios.filter(user => user.role === 'aluno').map(a => ({
            id: a.matricula || "ALU-OFF",
            nome: a.name,
            encontros: 1,
            semestre: a.semestre || "2025.1"
        }));

        // --- CÁLCULOS DE MÉTRICAS ---
        const totalCertificadosCount = certificadosGlobais.length;
        const totalRelatorios = relatoriosReais.length || 1;

        // Processamento de dificuldades (Lógica original)
        const countsDif = { conteudo: 0, acesso: 0, funcionamento: 0, outras: 0 };
        relatoriosReais.forEach(rel => {
            if (rel.dificuldadeTipo === 'conteudo') countsDif.conteudo++;
            if (rel.dificuldadeTipo === 'acesso') countsDif.acesso++;
            if (rel.dificuldadeTipo === 'funcionamento') countsDif.funcionamento++;
        });

        const novasDificuldades = [
            { titulo: "Dificuldades Acadêmicas", desc: "Conteúdos específicos", perc: `${((countsDif.conteudo / totalRelatorios) * 100).toFixed(0)}%`, icon: "📚" },
            { titulo: "Funcionamento da Universidade", desc: "Processos internos", perc: `${((countsDif.funcionamento / totalRelatorios) * 100).toFixed(0)}%`, icon: "🏫" },
            { titulo: "Acesso a serviços", desc: "Portais e sistemas", perc: `${((countsDif.acesso / totalRelatorios) * 100).toFixed(0)}%`, icon: "🔐" },
            { titulo: "Outras dificuldades", desc: "Diversos", perc: `${((countsDif.outras / totalRelatorios) * 100).toFixed(0)}%`, icon: "❓" }
        ];

        const novasMetricas = [
            { label: "Tutorandos Ativos", val: listaAlunosMock.length, icon: "🎓" },
            { label: "Tutores", val: listaTutoresMock.length, icon: "🏫" },
            { label: "Experiência da Tutoria", val: "85%", icon: "😊" },
            { label: "Encontros Realizados", val: relatoriosReais.reduce((acc, curr) => acc + Number(curr.encontrosTotais || 0), 0), icon: "📅" },
            { label: "Certificados", val: totalCertificadosCount, icon: "🏅" },
        ];

        setDadosDashboard(prev => ({
            ...prev,
            metricas: novasMetricas,
            dificuldades: novasDificuldades,
            tutores: listaTutoresMock,
            tutorandos: listaAlunosMock,
            dificuldadesGrafico: [
                { name: 'Conteúdo', sim: countsDif.conteudo, nao: totalRelatorios - countsDif.conteudo },
                { name: 'Acesso', sim: countsDif.acesso, nao: totalRelatorios - countsDif.acesso },
                { name: 'Outras', sim: countsDif.outras, nao: totalRelatorios - countsDif.outras },
            ],
            usuario: { name: usuarioLogado.name }
        }));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate('/');
    };

    const downloadCSV = () => {
        const cargo = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';
        let csv = `--- Relatório de Gestão Geral - NEXTCERTIFY ---\n`;
        csv += `Emitido por: ${usuario.name} (${cargo})\n`;
        csv += `Data: ${new Date().toLocaleDateString()}\n\n`;

        csv += "--- Resumo Geral ---\n";
        csv += "Indicador,Valor\n";
        dadosDashboard.metricas.forEach(m => {
            csv += `${m.label},${m.val}\n`;
        });
        csv += "\n";

        csv += "--- Tutorandos ---\n";
        csv += "Matrícula,Nome,Semestre\n";
        dadosDashboard.tutorandos.forEach(t => {
            csv += `${t.id},${t.nome},${t.semestre}\n`;
        });
        csv += "\n";

        csv += "--- Tutores ---\n";
        csv += "Matrícula,Nome,Encontros,Semestre\n";
        dadosDashboard.tutores.forEach(t => {
            csv += `${t.id},${t.nome},${t.encontros},${t.semestre}\n`;
        });
        csv += "\n";

        csv += "--- Maiores Dificuldades dos Tutorandos ---\n";
        csv += "Dificuldade,Percentual\n";
        dadosDashboard.dificuldades.forEach(d => {
            csv += `${d.titulo},${d.perc}\n`;
        });

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio_gestao_geral_Responsavel:${usuario.name.toLowerCase()}_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    const downloadPDF = async () => {
        const areaGraficos = document.getElementById('area-graficos');
        const doc = new jsPDF();
        const dataAtual = new Date().toLocaleDateString();
        const cargo = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text("Relatório de Gestão Geral - NEXTCERTIFY", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Emitido por: ${usuario.name} (${cargo})`, 14, 28);
        doc.text(`Data de emissão: ${dataAtual}`, 14, 34);

        autoTable(doc, {
            startY: 40,
            head: [["Indicador", "Valor"]],
            body: dadosDashboard.metricas.map(m => [m.label, m.val]),
            headStyles: { fillColor: [26, 86, 219] },
        });

        if (areaGraficos) {
            try {
                const canvas = await html2canvas(areaGraficos, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                doc.addPage();
                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Análise Visual de Desempenho", 14, 15);
                doc.addImage(imgData, 'PNG', 10, 25, 160, 90);
            } catch (e) {
                console.error("Erro ao gerar imagem", e);
            }
        }

        doc.addPage();
        doc.text("Detalhamento de Tutores e Alunos", 14, 15);
        autoTable(doc, {
            startY: 20,
            head: [["Matrícula", "Nome", "Encontros", "Semestre"]],
            body: dadosDashboard.tutores.map(t => [t.id, t.nome, t.encontros, t.semestre]),
            headStyles: { fillColor: [26, 86, 219] },
        });

        doc.text("Lista de Tutorandos", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [["Matrícula", "Nome", "Semestre"]],
            body: dadosDashboard.tutorandos.map(t => [t.id, t.nome, t.semestre]),
            headStyles: { fillColor: [99, 86, 219] },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - NextCertify © 2026`, 14, doc.internal.pageSize.height - 10);
        }
        doc.save(`relatorio_gestao_geral_Responsavel:${usuario.name.toLowerCase()}_${new Date().getDate()}.pdf`);
    };

    const gradientStyle = { background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', color: 'white' };
    const cardHeaderStyle = { fontSize: '0.85rem', color: '#0056b3', fontWeight: 'bold' };
    const valueStyle = { fontSize: '1.2rem', fontWeight: '500', color: '#555' };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#"><Image src={LogoNextCertify} alt="Logo" height="40" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link href="#" className="mx-2 text-dark">Alunos</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Tutores</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Predefinições</Nav.Link>

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
                <h2 className="text-primary fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Relatório de Gestão Geral</h2>

                <Row className="g-3 mb-4">
                    {dadosDashboard.metricas.map((item, idx) => (
                        <Col key={idx} md>
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

                <Row className="mb-4 g-4" id="area-graficos">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Encontros Realizados</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dadosDashboard.graficos}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
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
                                <LineChart data={dadosDashboard.graficos}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="boa" stroke="#28a745" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="ruim" stroke="#dc3545" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Apresentou Dificuldades</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={dadosDashboard.dificuldadesGrafico}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="sim" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="nao" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-5">
                    <Col md={12}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Certificados Enviados pelos Alunos (Validação)</h6>
                            <Table hover responsive borderless className="text-muted">
                                <thead className="border-bottom">
                                    <tr><th>Aluno</th><th>Título</th><th>Horas</th><th>Data</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {(JSON.parse(localStorage.getItem("lista_global_certificados") || "[]")).map((cert, i) => (
                                        <tr key={i}>
                                            <td>{cert.alunoNome || cert.aluno || "Não identificado"}</td>
                                            <td>{cert.titulo}</td>
                                            <td>{cert.horas}h</td>
                                            <td>{cert.periodo || cert.data}</td>
                                            <td><Badge bg={cert.status === 'aprovado' ? 'success' : 'warning'}>{cert.status}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-5 g-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Tutorandos</h6>
                            <Table hover responsive borderless size="sm" className="text-muted">
                                <thead><tr><th>Matrícula</th><th>Nome</th><th>Encontros</th><th>Semestre</th></tr></thead>
                                <tbody>
                                    {dadosDashboard.tutorandos.map((tuto, i) => (
                                        <tr key={i}><td>{tuto.id}</td><td>{tuto.nome}</td><td>{tuto.encontros}</td><td>{tuto.semestre}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Tutores</h6>
                            <Table hover responsive borderless size="sm" className="text-muted">
                                <thead><tr><th>Matrícula</th><th>Nome</th><th>Encontros</th><th>Semestre</th></tr></thead>
                                <tbody>
                                    {dadosDashboard.tutores.map((tut, e) => (
                                        <tr key={e}><td>{tut.id}</td><td>{tut.nome}</td><td>{tut.encontros}</td><td>{tut.semestre}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Maiores dificuldades dos tutorandos</h6>
                            <ListGroup variant="flush">
                                {dadosDashboard.dificuldades.map((dif, i) => (
                                    <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center border-0 px-0 mb-2">
                                        <div>{dif.icon} <strong>{dif.titulo}</strong><br /><small className="text-muted">{dif.desc}</small></div>
                                        <span className="fw-bold text-primary">{dif.perc}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
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

export default RelatoriosCoordenador;