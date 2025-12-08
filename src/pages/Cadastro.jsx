import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'; 

import InputFlutuante from '../components/InputFlutuante';
import BotaoPrincipal from '../components/BotaoPrincipal';

import ImagemCadastro from '../img/signin.png'; 
import { register } from '../services/authService'; 

function Cadastro() {
    const navigate = useNavigate();

    const [dados, setDados] = useState({
        nome: '',
        matricula: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const handleChange = (e) => {
        setDados({ ...dados, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (dados.senha !== dados.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            await register(dados.nome, dados.matricula, dados.email, dados.senha);
            alert("Cadastro realizado com sucesso! Faça o login.");
            navigate('/');
        } catch (err) {
            alert(err?.message || "Erro ao cadastrar. Tente novamente.");
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)',
            backgroundColor: '#00b0c8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Container style={{ maxWidth: '1100px' }}>
                <Row className="align-items-center">
                    
                    <Col lg={6} className="d-none d-lg-flex justify-content-center mb-5 mb-lg-0">
                        <Image 
                            src={ImagemCadastro} 
                            fluid 
                            alt="Ilustração Cadastro" 
                            style={{ width: '100%', maxWidth: '650px' }}
                        />
                    </Col>

                    <Col lg={6}>
                        <div className="bg-white p-5 shadow-lg rounded-4">
                            <Form className="w-100" onSubmit={handleSubmit}>
                                
                                <h2 className="text-primary fw-bold mb-2" style={{ fontSize: '2.5rem' }}>Cadastre-se</h2>
                                <p className="mb-4 text-muted">
                                    Já tem cadastro? <Link to="/" className="text-decoration-none fw-bold">Faça login!</Link>
                                </p>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="text" id="nome" label="Nome Completo"
                                        value={dados.nome} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="text" id="matricula" label="Matrícula"
                                        value={dados.matricula} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="email" id="email" label="Email"
                                        value={dados.email} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="password" id="senha" label="Senha"
                                        value={dados.senha} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputFlutuante 
                                        type="password" id="confirmarSenha" label="Confirmar sua senha"
                                        value={dados.confirmarSenha} onChange={handleChange}
                                    />
                                </div>

                                <div className="py-2">
                                     <BotaoPrincipal texto="Cadastrar" type="submit" />
                                </div>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Cadastro;