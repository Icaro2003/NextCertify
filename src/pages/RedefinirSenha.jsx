import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { MdSupportAgent } from "react-icons/md";

import InputFlutuante from '../components/InputFlutuante';
import BotaoPrincipal from '../components/BotaoPrincipal';

import '../css/form-pages.css';
import '../css/forms.css';
import ImagemRedefinir from '../img/forgot_password.png'; // Confira o nome da imagem

function RedefinirSenha() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simula o envio do email e vai para a próxima etapa
        console.log("Enviando código para:", email);
        navigate('/verificar-codigo'); 
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
                    
                    <Col lg={6} className="mb-5 mb-lg-0">
                        <div className="bg-white p-5 shadow-lg rounded-4">
                            <Form className="w-100" onSubmit={handleSubmit}>
                                
                                <h1 className="text-primary fw-bold mb-2">Redefinir<br/>sua senha</h1>
                                <p className="mb-4 text-muted">
                                    Informe seu e-mail e enviaremos um código para recuperação da senha
                                </p>

                                <div className="mb-4">
                                    <InputFlutuante 
                                        type="text"
                                        id="email-recuperacao"
                                        label="Email ou Usuário"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="py-2">
                                    <BotaoPrincipal 
                                        texto="Enviar" 
                                        type="submit" 
                                    />
                                </div>

                                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                    <Link to="/contato" className="d-flex align-items-center gap-2 text-decoration-none fw-bold text-primary">
                                        <MdSupportAgent size={24} />
                                        <span>Atendimento ao cliente</span>
                                    </Link>
                                </div>
                                
                                <div className="text-center mt-3">
                                    <Link to="/" className="text-muted small text-decoration-none">Voltar para o Login</Link>
                                </div>

                            </Form>
                        </div>
                    </Col>

                    <Col lg={6} className="d-none d-lg-flex justify-content-center">
                        <Image 
                            src={ImagemRedefinir} 
                            fluid 
                            alt="Ilustração Redefinir Senha" 
                            style={{ width: '100%', maxWidth: '650px' }} 
                        />
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default RedefinirSenha;