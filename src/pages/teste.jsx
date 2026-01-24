// O código é para testes de componentes do React, NÃO APAGUE.

import { Container, Row, Col, Card, Button, Navbar, Nav, Table, Form, Modal, Spinner, Badge, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaUserEdit, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import roleService from '../services/roleService';
import useAlert from '../hooks/useAlert';
import AlertBox from '../components/AlertBox';

function Teste() {
    const { show, setShow, message, variant, key, handleAlert } = useAlert();


    const navigate = useNavigate();
    const { usuario, token, userRole, handleLogout } = useAuthenticatedUser();

    // Estados
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userSelecionado, setUserSelecionado] = useState(null);
    const [novoPapel, setNovoPapel] = useState('');

    const gradientStyle = {
        background: 'linear-gradient(135deg, #005bea 0%, #00c6fb 100%)',
        color: 'white'
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                const listaUsers = await roleService.listAllUsers(token);
                setUsuarios(listaUsers);
            } catch (error) {
                console.error("Erro detalhado no carregamento:", error);
                alert(`Erro ao carregar dados: ${error.message}`);
            } finally {
                setCarregando(false);
            }
        };

        if (token && usuario) {
            carregarDados();
        }
    }, [usuario, token, navigate, userRole]);

    const handleOpenModal = (user) => {
        setUserSelecionado(user);
        setNovoPapel(user.role || 'student');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUserSelecionado(null);
        setNovoPapel('');
        setShow(false);
    };


    const handleSave = async (acaoFinal = 'atribuir') => {
        try {
            setCarregando(true);

            await roleService.attributeRole(userSelecionado.id, novoPapel, acaoFinal, token);

            alert(`Papel de ${acaoFinal} executado com sucesso!`);
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            handleAlert(error.message);
        } finally {
            setCarregando(false);
        }
    };


    const roleStr = userRole(usuario?.role);
    if (!usuario || roleStr?.toLowerCase() !== 'coordenador') {
        return <div className="p-5 text-center">Verificando permissões...</div>;
    }

    return (
        <>
            <Container className='py-5'>
                <h2 className="fw-bold m-0 text-primary"><FaShieldAlt className="me-2" /> Gerenciamento de Papéis</h2>
                <p className="mt-2 text-secondary">Atribua permissões e perfis acadêmicos aos usuários do sistema.</p>
            </Container>

            <Container className="flex-grow-1">
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Body className="p-0">
                        {carregando ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                        ) : (
                            <Table responsive hover className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3">Nome</th>
                                        <th>Email</th>
                                        <th className="text-end px-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-4 fw-bold">{u.nome}</td>
                                            <td>{u.email}</td>
                                            <td className="text-end px-4">
                                                <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(u)}>
                                                    <FaUserEdit className="me-1" /> Alterar Papel
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold text-primary">Alterar Perfil: {userSelecionado?.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label className="fw-bold">Papel do Sistema</Form.Label>
                                <Form.Select value={novoPapel} onChange={(e) => setNovoPapel(e.target.value)}>
                                    <option value="tutor">Tutor</option>
                                    <option value="bolsista">Bolsista</option>
                                    <option value="coordenador">Coordenador</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <AlertBox
                            show={show}
                            message={message}
                            variant={variant}
                            key={key}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="link" onClick={handleCloseModal} className="text-muted">Cancelar</Button>
                    <Button variant="danger" onClick={() => handleSave("remover")} disabled={carregando} className="px-4 fw-bold">
                        {carregando ? <Spinner size="sm" /> : "Remover Papel"}
                    </Button>
                    <Button variant="primary" onClick={() => handleSave("atribuir")} disabled={carregando} className="px-4 fw-bold">
                        {carregando ? <Spinner size="sm" /> : "Confirmar Alterações"}
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default Teste;