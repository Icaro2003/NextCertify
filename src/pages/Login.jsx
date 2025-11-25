import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { MdSupportAgent } from "react-icons/md";

// Importando CSS
import '../css/form-pages.css';
import '../css/forms.css';

// Importando Imagem
import LoginIgm from '../img/login.png';

// Importando Componentes
import InputFlutuante from "../components/InputFlutuante";
import BotaoPrincipal from "../components/BotaoPrincipal";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", { email, senha });
        
        alert("Login realizado! (Aguardando telas do Dashboard)");
        
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
                    
                    {/* LADO ESQUERDO: Imagem Solta */}
                    <Col lg={6} className="d-none d-lg-flex justify-content-center mb-5 mb-lg-0">
                        <Image 
                            src={LoginIgm} 
                            fluid 
                            alt="Login Ilustração" 
                            style={{ width: '100%', maxWidth: '650px' }} 
                        />
                    </Col>

                    {/* LADO DIREITO: Card Branco */}
                    <Col lg={6}>
                        <div className="bg-white p-5 shadow-lg rounded-4">
                            <Form className="w-100" onSubmit={handleSubmit}>
                                
                                <h1 className="text-primary fw-bold mb-2">Olá,<br />tudo bem?</h1>
                                <p className="mb-4 text-muted">
                                    Novo(a) por aqui? <Link to="/cadastro" className="text-decoration-none fw-bold">Inscreva-se!</Link>
                                </p>

                                {/* Campo Email */}
                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="text"
                                        id="usuario-email"
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* Campo Senha */}
                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="password"
                                        id="usuario-senha"
                                        label="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                </div>

                                {/* Lembrar-me e Esqueci Senha */}
                                <div className="d-flex align-items-center justify-content-between mt-3 mb-3">
                                    <Form.Check 
                                        type="checkbox" 
                                        label="Lembrar-me" 
                                        className="remember" 
                                    />
                                    <Link to="/redefinir-senha" class="text-decoration-none small text-muted">
                                        Esqueceu a senha?
                                    </Link>
                                </div>

                                {/* Botão de Login */}
                                <div className="py-2">
                                    <BotaoPrincipal 
                                        texto="Fazer Login" 
                                        type="submit" 
                                    />
                                </div>

                                {/* Link de Suporte */}
                                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                    <Link to="/contato" className="d-flex align-items-center gap-2 text-decoration-none text-secondary">
                                        <MdSupportAgent size={24} />
                                        <span>Atendimento ao cliente</span>
                                    </Link>
                                </div>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;