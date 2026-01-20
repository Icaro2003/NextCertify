import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Image } from 'react-bootstrap';
import { FaUserEdit, FaSave, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';

function EditarPerfil() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [form, setForm] = useState({
        name: '',
        matricula: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!u) {
            navigate('/');
            return;
        }
        setUsuario(u);
        setForm({
            name: u.name || '',
            matricula: u.matricula || '',
            email: u.email || '',
            password: ''
        });
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleCancel = () => navigate('/aluno');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            alert("Nome e e-mail são obrigatórios.");
            return;
        }

        // Validação de e-mail único entre os usuários salvos
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const emailExists = usuarios.some(u => u.email === form.email && u.id !== usuario.id);
        if (emailExists) {
            alert('E-mail já cadastrado.');
            return;
        }

        const updatedUsuarios = usuarios.slice();
        const idx = updatedUsuarios.findIndex(u => u.id === usuario.id);
        const updatedUser = {
            ...usuario,
            name: form.name,
            matricula: form.matricula,
            email: form.email,
            ...(form.password ? { password: form.password } : {})
        };

        if (idx >= 0) {
            updatedUsuarios[idx] = { ...updatedUsuarios[idx], ...updatedUser };
        } else {
            updatedUsuarios.push(updatedUser);
        }

        //NÃO APAGAR POR ENQUANTO, POR FAVOR
        localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));
        localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
        setUsuario(updatedUser);
        setForm(prev => ({ ...prev, password: '' }));

        alert('Dados atualizados com sucesso.');
        navigate('/aluno');
    };

    if (!usuario) return <div>Carregando...</div>;


    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" onClick={() => navigate('/aluno')} style={{ cursor: 'pointer' }}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="text-center mx-auto fw-medium">
                            <Nav.Link href="/aluno" className="mx-2 text-dark">Home</Nav.Link>
                            <Nav.Link href="/meus-certificados" className="mx-2 text-dark">Certificados</Nav.Link>

                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.name}</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <div className="bg-white p-4 rounded-4 shadow-sm">
                            <h3 className="text-primary fw-bold mb-4"><FaUserEdit /> &nbsp; Editar Perfil</h3>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Nome</Form.Label>
                                    <Form.Control id="name" type="text" value={form.name} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Matrícula</Form.Label>
                                    <Form.Control id="matricula" type="text" value={form.matricula} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">E-mail</Form.Label>
                                    <Form.Control id="email" type="email" value={form.email} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Nova senha (opcional)</Form.Label>
                                    <Form.Control id="password" type="password" value={form.password} onChange={handleChange} placeholder="Deixe em branco para manter a atual" />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="outline-secondary" onClick={handleCancel}><FaTimes /> &nbsp; Cancelar</Button>
                                    <Button variant="primary" type="submit"><FaSave /> &nbsp; Salvar</Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '20px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <small>© 2025 - NextCertify</small>
                </Container>
            </footer>
        </div>
    );
}

export default EditarPerfil;