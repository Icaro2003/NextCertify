import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { MdSupportAgent } from "react-icons/md";
import LoginIgm from '../img/login.png';
import InputFlutuante from "../components/InputFlutuante";
import BotaoPrincipal from "../components/BotaoPrincipal";
import useAlert from '../hooks/useAlert';
import AlertBox from '../components/AlertBox';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const { show, message, variant, alertKey, handleAlert } = useAlert();

    const login = async () => {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            throw new Error(response.statusText || "Usuário ou senha inválidos");
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);

        return data;
    };

    const navigateRole = (role) => {
        const roleRoutes = {
            scholarship_holder: "/bolsista",
            tutor: "/home-tutor",
            coordinator: "/coordenador",
        };

        const route = roleRoutes[role];

        if (!route) {
            console.log(`Perfil não definido! ${role}`);
            return;
        }

        if (route === "/bolsista") {
            const perfil = localStorage.getItem("perfil");
            
            if (perfil === "ALUNO") {
                navigate("/aluno");
                return;
            }
        }

        navigate(route);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login();

            const decoded = jwtDecode(data.token);
            console.log(decoded);
            
            navigateRole(decoded.role);
        } catch (error) {
            handleAlert(error?.message || "Usuário não encontrado!");
        }
    };

    return (
        <div className='d-flex align-items-center justify-content-center p-5' style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #00C6FF, #0072FF)',
            backgroundColor: '#00b0c8',
        }}>
            <Container style={{ maxWidth: '1100px' }}>
                <Row className="align-items-center">

                    <Col lg={6} className="d-flex justify-content-center align-items-center mb-0">
                        <Image
                            src={LoginIgm}
                            fluid
                            alt="Login Ilustração"
                            style={{ width: '100%', maxWidth: '550px' }}
                        />
                    </Col>

                    <Col lg={6}>
                        <div className="bg-white p-5 shadow-lg rounded-4">
                            <Form className="w-100" onSubmit={handleSubmit}>

                                <h1 className="text-primary fw-bold mb-2">Olá,<br />tudo bem?</h1>
                                <p className="mb-4 text-muted">
                                    Novo(a) por aqui? <Link to="/cadastro" className="text-decoration-none">Inscreva-se!</Link>
                                </p>

                                <div className="mb-3">
                                    <InputFlutuante
                                        type="text"
                                        id="usuario-email"
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante
                                        type="password"
                                        id="usuario-senha"
                                        label="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                </div>

                                <div className="d-flex align-items-center justify-content-between mt-3 mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Lembrar-me"
                                        className="remember"
                                        id='remember'
                                    />
                                    <Link to="/redefinir-senha" className="text-decoration-none small">
                                        Esqueceu a senha?
                                    </Link>
                                </div>

                                <AlertBox
                                    show={show}
                                    message={message}
                                    variant={variant}
                                    key={alertKey}
                                />

                                <div className="py-2">
                                    <BotaoPrincipal
                                        texto="Fazer Login"
                                        type="submit"
                                    />
                                </div>

                                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                    <Link to="/contato" className="d-flex align-items-center gap-2 text-decoration-none">
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