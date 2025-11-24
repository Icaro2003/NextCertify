import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import '../css/form-pages.css';
import '../css/forms.css';
import LoginIgm from '../img/login.png';
import { MdSupportAgent } from "react-icons/md";

function FormLogin() {
    return (
        <Container fluid className="d-flex flex-wrap justify-content-center align-items-center " style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={5} className="background-image d-flex justify-content-center align-items-center">
                    <Image src={LoginIgm} fluid alt="Login" id="login-img" />
                </Col>

                <Col md={5} className="form-container">
                    <Form className="bg-light w-100 user-form" id="user-form" onSubmit={(e) => e.preventDefault()}>
                        <h1 className="text-primary">Olá,<br />tudo bem?</h1>
                        <p>
                            Novo(a) por aqui? <a href="#">Inscreva-se!</a>
                        </p>

                        <div className="label-float">
                            <Form.Control type="text" name="usuario-nome" id="usuario-nome" placeholder=" " required />
                            <label htmlFor="usuario-nome">Email</label>
                        </div>

                        <div className="label-float mt-3">
                            <Form.Control type="password" name="usuario-senha" id="usuario-senha" placeholder=" " required />
                            <label htmlFor="usuario-senha">Senha</label>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <Form.Check
                                type="checkbox"
                                id="remember-me"
                                label="Lembrar-me"
                                className="remember"
                            />
                            <a href="#" className="forgot-link">Esqueceu a senha?</a>
                        </div>

                        <div className="d-flex justify-content-center mt-3" id="alert">
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="primary" type="submit" className="w-100 form-button">
                                Fazer login
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                            <a href="#" className="d-flex justify-content-center align-items-center gap-2 text-decoration-none">
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