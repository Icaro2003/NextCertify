import { Container, Row, Col, Card, Button, Navbar, Nav, Image, Table, ListGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaFilePdf, FaFileCsv, FaSignOutAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';

function RelatorioIndividualTutor() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();
    const [tutorSelecionado, setTutorSelecionado] = useState("");
    const [listaTutores, setListaTutores] = useState([]);

    const [dadosDashboard, setDadosDashboard] = useState({
        usuario: { name: "" },
        metricas: [],
        graficos: [],
        tutorandos: [],
        dificuldades: [],
        dificuldadesGrafico: []
    });

    useEffect(() => {
        const relatorioReais = JSON.parse(localStorage.getItem("relatorios_cadastrados") || "[]");
        const nomesTutores = [...new Set(relatorioReais.map(r => r.tutorNome))];
        setListaTutores(nomesTutores);
        const tutorParaExibir = tutorSelecionado || (nomesTutores.length > 0 ? nomesTutores[0] : "");

        if(tutorParaExibir){
            const filtrados = relatorioReais.filter(r => r.tutorNome === tutorParaExibir);
            const totalEncontros = filtrados.reduce((acc, curr) => acc + curr.encontrosTotais, 0);
            const alunosAtendidos = [...new Set(filtrados.map(r => r.aluno))].length;
            const counts = { conteudo: 0, acesso: 0, nenhuma: 0, outras: 0 };
            filtrados.forEach(r => {
                if (counts[r.dificuldadeTipo] !== undefined) counts[r.dificuldadeTipo]++;
            });

            setDadosDashboard({
                usuario: { name: tutorParaExibir },
                metricas: [
                    { label: "Total de Relatórios", val: filtrados.length, icon: "📄" },
                    { label: "Total de Encontros", val: totalEncontros, icon: "👥" },
                    { label: "Alunos Distintos", val: alunosAtendidos, icon: "🎓" },
                    { label: "Média Mensal", val: (filtrados.length / 1).toFixed(1), icon: "📊" }
                ],
                tutorandos: filtrados.map(r => ({
                    id: r.matricula,
                    nome: r.aluno,
                    encontros: r.encontrosTotais,
                    semestre: "2025.1"
                })),
                dificuldadesGrafico: [
                    { name: 'Conteúdo', sim: counts.conteudo, nao: filtrados.length - counts.conteudo },
                    { name: 'Acesso', sim: counts.acesso, nao: filtrados.length - counts.acesso },
                    { name: 'Outras', sim: counts.outras, nao: filtrados.length - counts.outras },
                ],
                dificuldades: [
                    { titulo: "Conteúdo", perc: `${((counts.conteudo/filtrados.length)*100).toFixed(0)}%`, icon: "📚", desc: "Dificuldade técnica" },
                    { titulo: "Acesso", perc: `${((counts.acesso/filtrados.length)*100).toFixed(0)}%`, icon: "🌐", desc: "Internet/Plataforma" }
                ],
                graficos: [
                    { name: 'Sem 1', online: 2, presencial: 1 }, // Exemplo estático ou processar por data
                    { name: 'Sem 2', online: 3, presencial: 2 },
                ]
            });
        }
    }, [tutorSelecionado]);

    const downloadCSV = () => {
        const tutorNome = tutorSelecionado || "Geral";
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        let csv = `--- Relatório Individual do Tutor - NextCertify ---\n`;
        csv += `Tutor: ${tutorNome}\n`;
        csv += `Emitido por: ${usuario.name} (${cargoEmitente})\n`;
        csv += `Data: ${new Date().toLocaleDateString()}\n\n`;

        csv += "--- Resumo de Desempenho ---\n";
        csv += "Indicador,Valor\n";
        dadosDashboard.metricas.forEach(m=> {
            csv += `${m.label},${m.val}\n`;
        });
        csv += "\n";

        csv += "--- Histórico de Encontros ---\n";
        csv += "Matrícula,Nome do Aluno,Encontros Totais,Semestre\n";
        dadosDashboard.tutorandos.forEach(t => {
            csv += `${t.id},${t.nome},${t.encontros},${t.semestre}\n`;
        });
        csv += "\n";

        csv += "--- Frequência de Dificuldades ---\n";
        csv += "Dificuldade,Percentual\n";
        dadosDashboard.dificuldades.forEach(d => {
            csv += `${d.titulo},${d.perc}\n`;
        });

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download= `relatorio_individual_tutor_Responsavel:${usuario.name.replace(/\s+/g, '_').toLocaleLowerCase()}.csv`;
        link.click();
    };

    const downloadPDF = async () => {
        const areaGraficos = document.getElementById("area-graficos-tutor");
        const tutorNome = tutorSelecionado || "Geral";
        const doc = new jsPDF();
        const dataAtual = new Date().toLocaleDateString();
        const cargoEmitente = usuario.role === 'coordenador' ? 'Coordenador' : 'Bolsista';

        doc.setFontSize(18);
        doc.setTextColor(26, 86, 219);
        doc.text("Relatório Individual do Tutor - NEXTCERTIFY", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Tutor Analisado: ${tutorNome}`, 14, 28);
        doc.text(`Emitido por: ${usuario.name} (${cargoEmitente})`, 14, 34);
        doc.text(`Data de Emissão: ${dataAtual}`, 14, 40);

        autoTable(doc,{
            startY: 46,
            head: [['Indicador', 'Valor']],
            body: dadosDashboard.metricas.map(m => [m.label, m.val]),
            headStyles: { fillColor: [26, 86, 219] },
        });

        if(areaGraficos){
            try{
                const canvas = await html2canvas(areaGraficos, { scale: 2, useCORS: true, logging:false });
                const imgData = canvas.toDataURL('image/png');
                const finalYMetricas = doc.lastAutoTable.finalY;
                if(finalYMetricas > 150) doc.addPage();

                const currentY = doc.lastAutoTable.finalY > 150 ? 20 : finalYMetricas + 15;

                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Análise Visual dos encontros", 14, currentY);
                doc.addImage(imgData, 'PNG', 10, currentY + 5, 190, 80);
            } catch(e) {
                console.error("Erro ao capturar gráficos para PDF:", e);
            }
        }

        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(26, 86, 219);
        doc.text("Histórico de encontros", 14, 15);

        autoTable(doc, {
            startY: 20,
            head: [['Matrícula', 'Nome do Aluno', 'Encontros Totais', 'Semestre']],
            body: dadosDashboard.tutorandos.map(t => [t.id, t.nome, t.encontros, t.semestre]),
            headStyles: { fillColor: [99, 102, 219] },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++){
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount} - NextCertify © 2026`, 14, doc.internal.pageSize.height - 10);
        }
        doc.save(`relatorio_individual_tutor_Responsavel:${usuario.name.replace(/\s+/g, '_').toLocaleLowerCase()}.pdf`);
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
                            <Nav.Link href="#" className="mx-2 text-dark">Alunos</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Tutores</Nav.Link>
                            <Nav.Link href="#" className="mx-2 text-dark">Predefinições</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                {/* CORREÇÃO AQUI: Adicionado o ?. para evitar erro caso usuario seja null */}
                                <span className="fw-bold text-dark">{usuario?.name || "Carregando..."}</span>
                            </div>
                            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                                <FaSignOutAlt size={16} /> Sair
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="flex-grow-1">
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
                                {listaTutores.map((nome, idx) => (
                                    <option key={idx} value={nome}>{nome}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>

                {listaTutores.length === 0 ? (
                    <div className="alert alert-info shadow-sm border-0">
                        Nenhum relatório foi encontrado no sistema.
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
                                    <h6 className="fw-bold mb-3">Histórico de Atendimento: {dadosDashboard.usuario.name}</h6>
                                    <Table hover responsive borderless size="sm" className="text-muted">
                                        <thead className="border-bottom">
                                            <tr><th>Matrícula</th><th>Nome do Aluno</th><th>Encontros Totais</th><th>Semestre</th></tr>
                                        </thead>
                                        <tbody>
                                            {dadosDashboard.tutorandos.map((tuto, i) => (
                                                <tr key={i}>
                                                    <td>{tuto.id}</td>
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