import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Image } from 'react-bootstrap';
import { FaUserEdit, FaSave, FaTimes, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import NavbarRole from '../components/NavbarRole';

function EditarPerfil() {
    const navigate = useNavigate();
    const { usuario, token, userRole, handleLogout } = useAuthenticatedUser();
    const [form, setForm] = useState({
        nome: '',
        matricula: '',
        email: '',
        senha: ''
    });

    useEffect(() => {
        setForm({
            nome: usuario.nome,
            matricula: usuario.matricula,
            email: usuario.email,
            senha: ''
        });
    }, [usuario]);

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
            <NavbarRole userRole={userRole(usuario.role).toLowerCase()} />

            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <div className="bg-white p-4 rounded-4 shadow-sm">
                            <h3 className="text-primary fw-bold mb-4"><FaUserEdit /> &nbsp; Editar Perfil</h3>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Nome</Form.Label>
                                    <Form.Control id="name" type="text" value={form.nome} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Matrícula</Form.Label>
                                    <Form.Control id="matricula" type="text" disabled value={form.matricula} onChange={handleChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">E-mail</Form.Label>
                                    <Form.Control id="email" type="email" value={form.email} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Nova senha (opcional)</Form.Label>
                                    <Form.Control id="password" type="password" value={form.senha} onChange={handleChange} placeholder="Deixe em branco para manter a atual" />
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
            <footer style={{ background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)', padding: '30px 0', textAlign: 'center', color: 'white' }} className="mt-auto">
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>
        </div>
    );
}

export default EditarPerfil;