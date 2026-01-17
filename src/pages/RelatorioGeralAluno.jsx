import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import mockData from '/src/mocks/relatorio-geral-alunos-mock';
import mockAut from '../mocks/auth-mock.json'; // Importado para consolidar os usuários
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';

function RelatorioGeralAluno() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();

    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { name: "" },
        metricas: [],
        graficos: [],
        experienciaGrafico: [],
        tutorandosMantemTutoriaGrafico: [],
        horasCertificado: [],
        tutorandos: [],
        dificuldades: [],
        tutores: [],
        avaliacaoTutores: []
    });

    useEffect(() => {
        if (!usuario) return;
        const relatoriosTutores = JSON.parse(localStorage.getItem("relatorios_cadastrados") || "[]");
        const certificadosGlobais = JSON.parse(localStorage.getItem("lista_global_certificados") || "[]");
        const avaliacoesAlunos = JSON.parse(localStorage.getItem("@App:avaliacao") || "[]");  
        const listaUsuarios = Array.isArray(mockAut) ? mockAut : (mockAut.users || mockAut.usuarios || []);

        const tutoresReal = listaUsuarios.filter(u => u.role === 'tutor').map(t => {
            const notasDesteTutor = avaliacoesAlunos.filter(a => a.tutorId === t.matricula);
            const somaNotas = notasDesteTutor.reduce((acc, curr) => acc + Number(curr.avaliacaoTutor), 0);
            const media = notasDesteTutor.length > 0 
                ? (somaNotas / notasDesteTutor.length).toFixed(1) 
                : "N/A";
            return {
                id: t.matricula || "TUT-00",
                nome: t.name,
                encontros: relatoriosTutores.filter(r => r.tutorNome === t.name).length,
                avaliacao: media 
            };
        });

        // Filtrar Tutorandos
        const tutorandosReal = listaUsuarios.filter(u => u.role === 'aluno').map(a => ({
            id: a.matricula || "ALU-00",
            nome: a.name,
            encontros: relatoriosTutores.filter(r => r.alunoNome === a.name).length,
            semestre: a.semestre || "N/I"
        }));

        const metricasAtualizadas = [
            { label: "Tutorandos Ativos", val: tutorandosReal.length, icon: "🎓" },
            { label: "Total de Certificados", val: certificadosGlobais.length, icon: "🏅" },
            { label: "Encontros Realizados", val: relatoriosTutores.length, icon: "📅" },
            { label: "Média Geral Sat.", val: calcularMediaGeral(avaliacoesAlunos) + "%", icon: "📊" }
        ];

        setDadosDashboard({
            ...mockData,
            usuario: { name: usuario.name },
            metricas: metricasAtualizadas,
            tutorandos: tutorandosReal,
            tutores: tutoresReal,
            avaliacaoTutores: tutoresReal.filter(t => t.avaliacao !== "N/A") 
        });
    }, [usuario]);

    const calcularMediaGeral = (avaliacoes) => {
        if (avaliacoes.length === 0) return 0;
        const soma = avaliacoes.reduce((acc, curr) => acc + Number(curr.avaliacaoTutor), 0);
        return (soma / avaliacoes.length).toFixed(0);
    };

    const downloadCSV = () => {
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';
        let csv = "\uFEFFRelatório de Gestão Geral - Alunos e Tutores\n";
        csv += `Data de Exportação: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
        csv += `Responsável: ${usuario.name} (${cargoEmitente})\n\n`;

        csv += "--- Resumo Geral (Métricas) ---\n";
        csv += "Indicador,Valor\n";
        dadosDashboard.metricas.forEach(m => {
            csv += `"${m.label}", "${m.val}"\n`;
        });
        csv += "\n";

        csv += "--- Lista de Tutorandos ---\n";
        csv += "Matrícula,Nome,Semestre\n";
        dadosDashboard.tutorandos.forEach(t => {
            csv += `"${t.id}", "${t.nome}", "${t.semestre}"\n`;
        });
        csv += "\n";

        csv += "--- Avaliação dos Tutores ---\n";
        csv += "Matrícula,Nome,Encontros Realizados,Média de Avaliação\n";
        dadosDashboard.tutores.forEach(t => {
            csv += `"${t.id}", "${t.nome}", "${t.encontros}", "${t.avaliacao}"\n`;
        });
        csv += "\n";

        csv += "--- Mapeamento de Dificuldades dos Alunos ---\n";
        csv += "Dificuldade,Descrição,Percentual\n";
        dadosDashboard.dificuldades.forEach(d => {
            csv += `"${d.titulo}", "${d.desc}", "${d.perc}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=urf-8;"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dataArquivo = new Date().toISOString().split('T')[0];
        link.href = url;
        link.download = `relatorio_geral_alunos_Resposavel:${usuario.name}_${dataArquivo}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';
        doc.setFontSize(18);
        doc.text("Relatório Geral de Alunos", 14, 20);
        doc.setFontSize(12);
        doc.text(`Responsável: ${usuario.name} (${cargoEmitente})`, 14, 30);
        autoTable(doc, {
            startY: 40,
            head: [["Indicador", "Valor"]],
            body: dadosDashboard.metricas.map(m => [m.label, m.val]),
        });

        doc.text("Lista de Tutorandos", 14, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Matrícula", "Nome", "Semestre"]],
            body: dadosDashboard.tutorandos.map(t => [t.id, t.nome, t.semestre]),
        });
        doc.text("Avaliação dos Tutores", 14, doc.lastAutoTable.finalY + 10);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [["Matrícula", "Nome", "Média de Avaliação"]],
            body: dadosDashboard.avaliacaoTutores.map(av => [av.id, av.nome, av.avaliacao + "%"]),
        });

        doc.save(`relatorio_geral_alunos_Responsavel:${usuario.name}_${new Date().toLocaleDateString()}.pdf`);
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
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
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
                <h2 className="text-primary fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Relatório Geral Aluno</h2>

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

                <Row className="mb-4 g-4">
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
                                <LineChart data={dadosDashboard.experienciaGrafico}>
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
                </Row>

                <Row className="mb-5 g-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Tutorandos (Acompanhamento)</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dadosDashboard.tutorandosMantemTutoriaGrafico}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sim" stroke="#28a745" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="não" stroke="#dc3545" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3 h-100">
                            <h6 className="fw-bold text-dark">Horas por Certificado</h6>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={dadosDashboard.horasCertificado}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="estudos" stroke="#2563eb" strokeWidth={2} />
                                    <Line type="monotone" dataKey="eventos" stroke="#06b6d4" strokeWidth={2} />
                                    <Line type="monotone" dataKey="monitoria" stroke="#6366f1" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-5 g-4">
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Tutorandos</h6>
                            <Table hover responsive borderless size="sm" className="text-muted">
                                <thead><tr><th>Matrícula</th><th>Nome</th><th>Semestre</th></tr></thead>
                                <tbody>
                                    {dadosDashboard.tutorandos.map((tuto, i) => (
                                        <tr key={i}>
                                            <td>{tuto.id}</td>
                                            <td>{tuto.nome}</td>
                                            <td>{tuto.semestre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm p-3">
                            <h6 className="fw-bold mb-3">Maiores dificuldades</h6>
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

                <Row className="mb-5 g-4">
                    <Col md={6}><Card className="border-0 shadow-sm p-3">
                        <h6 className="fw-bold mb-3">Tutores</h6>
                        <Table hover responsive borderless size="sm">
                            <thead><tr><th>Matrícula</th><th>Nome</th><th>Encontros</th></tr></thead>
                            <tbody>{dadosDashboard.tutores.map((tut, i) => (<tr key={i}><td>{tut.id}</td><td>{tut.nome}</td><td>{tut.encontros}</td></tr>))}</tbody>
                        </Table>
                    </Card></Col>
                    <Col md={6}><Card className="border-0 shadow-sm p-3">
                        <h6 className="fw-bold mb-3">Avaliação de Tutores</h6>
                        <Table hover responsive borderless size="sm">
                            <thead><tr><th>Matrícula</th><th>Nome</th><th>Avaliação</th></tr></thead>
                            <tbody>{dadosDashboard.avaliacaoTutores.map((av, i) => (<tr key={i}><td>{av.id}</td><td>{av.nome}</td><td>{av.avaliacao} ⭐</td></tr>))}</tbody>
                        </Table>
                    </Card></Col>
                </Row>

                <div className="d-flex gap-3 mb-5">
                    <Button variant="primary" className="px-5 py-2 fw-bold border-0" style={{ backgroundColor: '#1a56db' }} onClick={downloadPDF}><FaFilePdf /> Baixar PDF</Button>
                    <Button variant="info" className="px-5 py-2 fw-bold text-white border-0" style={{ backgroundColor: '#06b6d4' }} onClick={downloadCSV}><FaFileCsv /> Baixar CSV</Button>
                </div>
            </Container>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container><h5 className="mb-0">© 2025 - NextCertify</h5></Container>
            </footer>
        </div>
    );
}

export default RelatorioGeralAluno;