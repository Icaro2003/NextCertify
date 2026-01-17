import { Navbar, Nav, Container, Button, Image } from "react-bootstrap";
import LogoNextCertify from '../img/NextCertify.png';
import { TbReportAnalytics } from "react-icons/tb";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import RecordsTable from "../components/RecordsTable";
import registroAlunos from "/src/mocks/auth-mock";
import { useNavigate } from "react-router-dom";

function RegistroAluno() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    if (!usuario) {
        return <div className="p-5 text-center">Carregando...</div>;
    }

    const alunos = registroAlunos.users.filter(user => user.role === "aluno");

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
                            <Nav.Link href="/registro-aluno" className="mx-2 text-dark">Alunos</Nav.Link>
                            <Nav.Link href="/registro-tutores" className="mx-2 text-dark">Tutores</Nav.Link>
                            <Nav.Link href="/predefinicoes" className="mx-2 text-dark">Predefinições</Nav.Link>
                            <Nav.Link href="/contato" className="mx-2 text-dark">Contato</Nav.Link>
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
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

                <div className="d-flex justify-content-end mb-3">
                    <Button
                        variant="primary"
                        className="px-4 py-2 d-flex justify-content-center align-items-center gap-1"
                        onClick={() => navigate('/relatorio-geral-aluno')}
                    >
                        <TbReportAnalytics size={25} className="text-light" />
                        <span>Relatório geral</span>
                    </Button>
                </div>

                {alunos.length > 0 &&
                    <RecordsTable user={alunos} route={'/relatorio-individual-aluno'} />
                }

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