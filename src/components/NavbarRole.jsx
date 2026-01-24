import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Image } from 'react-bootstrap';
import { FaUserEdit, FaSave, FaTimes, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LogoNextCertify from '../img/NextCertify.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';

function NavbarRole({ userRole }) {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useAuthenticatedUser();

    const navLinks = [
        // Aluno
        { path: '/aluno', label: 'Home', roles: ['aluno'] },
        { path: '/meus-certificados', label: 'Meus Certificados', roles: ['aluno'] },
        { path: '/avaliacao-tutoria', label: 'Avaliação da Tutoria', roles: ['aluno'] },

        // Tutor
        { path: '/home-tutor', label: 'Home', roles: ['tutor'] },
        { path: '/alunos-tutor', label: 'Alunos', roles: ['tutor'] },
        { path: '/forms-tutor', label: 'Formulário', roles: ['tutor'] },
        { path: '/relatorios-tutor', label: 'Relatórios', roles: ['tutor'] },

        // Bolsista / Coordenador
        { path: '/registro-aluno', label: 'Home', roles: ['bolsista', 'coordenador'] },
        { path: '/registro-tutores', label: 'Home', roles: ['bolsista', 'coordenador'] },
        { path: '/predefinicoes', label: 'Predefinições', roles: ['bolsista', 'coordenador'] },
        { path: '/relatorio-individual-tutor', label: 'Relatório Tutor', roles: ['bolsista', 'coordenador'] },
        { path: '/relatorio-individual-aluno', label: 'Relatório Aluno', roles: ['bolsista', 'coordenador'] },
        { path: '/validar-certificados', label: 'Validar Certificados', roles: ['bolsista', 'coordenador'] },
        { path: '/relatorio-geral-aluno', label: 'Relatório Geral Alunos', roles: ['bolsista', 'coordenador'] },
        { path: '/relatorio-geral-tutor', label: 'Relatório Geral Tutores', roles: ['bolsista', 'coordenador'] },

        // Coordenador
        { path: '/relatorios-coordenador', label: 'Relatório de Gestão Geral', roles: ['coordenador'] },
    ];

    return (
        <>
            <Navbar bg="white" expand="lg" className="shadow-sm py-3">
                <Container fluid className="px-5">
                    <Navbar.Brand href="#" onClick={() => navigate('/aluno')} style={{ cursor: 'pointer' }}>
                        <Image src={LogoNextCertify} alt="Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="text-center mx-auto fw-medium">
                            {navLinks.
                                filter(link => link.roles.includes(userRole(usuario.role))
                                    .map(link => (
                                        <Nav.Link
                                            key={link.path}
                                            onClick={() => navigate(link.path)}
                                            className="mx-2 text-dark"
                                        >
                                            {link.label}
                                        </Nav.Link>
                                    ))
                                )}
                        </Nav>
                        <div className="d-flex align-items-center gap-3">
                            <FaBell size={20} className="text-primary" />
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle size={32} className="text-primary" />
                                <span className="fw-bold text-dark">{usuario.nome}</span>
                            </div>
                            <Button variant="outline-danger" size="sim" className="d-flex align-items-center gap-2" onClick={handleLogout}><FaSignOutAlt size={16} /> Sair</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarRole;