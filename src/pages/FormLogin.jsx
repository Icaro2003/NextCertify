import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { MdSupportAgent } from "react-icons/md";
import '../css/form-pages.css';
import '../css/forms.css';
import LoginIgm from '../img/login.png';

// IMPORTANDO SEUS NOVOS COMPONENTES
import InputFlutuante from "../components/InputFlutuante";
import BotaoPrincipal from "../components/BotaoPrincipal";

function FormLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Login enviado: ${email}`);
    };

    return (
        <Container fluid className="d-flex flex-wrap justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={5} className="background-image d-flex justify-content-center align-items-center">
                    <Image src={LoginIgm} fluid alt="Login" id="login-img" />
                </Col>

                <Col md={5} className="form-container">
                    <Form className="bg-light w-100 user-form" onSubmit={handleSubmit}>
                        <h1 className="text-primary">Olá,<br />tudo bem?</h1>
                        <p>Novo(a) por aqui? <a href="#">Inscreva-se!</a></p>

                        {/* USANDO O COMPONENTE DE INPUT DE EMAIL */}
                        <InputFlutuante 
                            type="text"
                            id="usuario-email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* USANDO O COMPONENTE DE INPUT DE SENHA */}
                        <InputFlutuante 
                            type="password"
                            id="usuario-senha"
                            label="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />

                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <Form.Check type="checkbox" label="Lembrar-me" className="remember" />
                            <a href="#" className="forgot-link">Esqueceu a senha?</a>
                        </div>

                        {/* USANDO O COMPONENTE DE BOTÃO */}
                        <BotaoPrincipal 
                            texto="Fazer Login" 
                            type="submit" 
                        />

                        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <a href="#" className="d-flex gap-2 text-decoration-none">
                                <MdSupportAgent size={30} />
                                <span>Atendimento ao cliente</span>
                            </a>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default FormLogin;