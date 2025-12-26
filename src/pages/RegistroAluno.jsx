import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import LogoNextCertify from '../img/NextCertify.png';
import { TbReport } from "react-icons/tb";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function RegistroAluno() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        //Não apagar por enquanto para realizar os testes
        // Pegar os dados salvos no LocalStorage
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (usuarioLogado) {
            setUsuario(usuarioLogado);
        } else {
            // Vai retornar para login caso não tenha usuário logado
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        navigate('/');
    };

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    const theadPrimary = {
        background: 'var(--bs-primary)',
        color: 'white'
    };

    if (!usuario) {
        return <div>Carregando...</div>;
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
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
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link href="/aluno" className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link href="/meus-certificados" className="mx-2 text-dark">Certificados</Nav.Link>
                            <Nav.Link href="/avaliacao-tutoria" className="mx-2 text-dark">Avaliação Tutoria</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex justify-content-center align-items-center gap-5">
                            <FaBell size={20} className="text-primary" style={{ cursor: 'pointer' }} />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.name}</span>
                            </div>
                            <Button variant="outline-danger" size="sim" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <h1 className="text-primary fw-bold mb-3">Registro de Alunos</h1>

                <Table hover responsive className="text-center">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th style={theadPrimary}>#</th>
                            <th style={theadPrimary}>Aluno(a)</th>
                            <th style={theadPrimary}>E-mail</th>
                            <th style={theadPrimary}>Matrícula</th>
                            <th style={theadPrimary}>Certificados</th>
                            <th style={theadPrimary}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>João Silva</td>
                            <td>joao@teste.email.com</td>
                            <td>123456</td>
                            <td>2</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100 d-flex justify-content-center align-items-center gap-1"
                                >
                                    <TbReport size={25} className="text-light" />
                                    <span>Gerar certificado</span>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>João Silva</td>
                            <td>joao@teste.email.com</td>
                            <td>123456</td>
                            <td>2</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100 d-flex justify-content-center align-items-center gap-1"
                                >
                                    <TbReport size={25} className="text-light" />
                                    <span>Gerar certificado</span>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>João Silva</td>
                            <td>joao@teste.email.com</td>
                            <td>123456</td>
                            <td>2</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100 d-flex justify-content-center align-items-center gap-1"
                                >
                                    <TbReport size={25} className="text-light" />
                                    <span>Gerar certificado</span>
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>João Silva</td>
                            <td>joao@teste.email.com</td>
                            <td>123456</td>
                            <td>2</td>
                            <td>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100 d-flex justify-content-center align-items-center gap-1"
                                >
                                    <TbReport size={25} className="text-light" />
                                    <span>Gerar certificado</span>
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>

            <footer style={{ ...gradientStyle, padding: '30px 0', textAlign: 'center' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default RegistroAluno;