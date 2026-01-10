import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

import InputFlutuante from '../components/InputFlutuante';
import BotaoPrincipal from '../components/BotaoPrincipal';

import ImagemCadastro from '../img/signin.png';
import { register } from '../services/authService';

import AlertBox from '../components/AlertBox';
import useAlert from '../hooks/useAlert';

function Cadastro() {
    const navigate = useNavigate();

    const { show, message, variant, alertKey, handleAlert } = useAlert();

    const [dados, setDados] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        matricula: "",
        cpf: "",
    });

    const handleChange = (e) => {
        setDados({ ...dados, [e.target.id]: e.target.value });
    };

    const registerUser = async () => {
        await fetch("http://localhost:3000/api/users", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
                matricula: dados.matricula,
                cpf: dados.cpf,
                status: "ATIVO"
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(data.message || "Erro na requisição");
                }

                return response.json();
            })
            .catch((error) => handleAlert(error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        registerUser();
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

                                {/* <Form.Select
                                    required
                                    id='curso'
                                    className='mb-3 label-float'
                                    value={dados.curso}
                                    onChange={handleChange}
                                    style={
                                        {
                                            border: '1px solid #8C8B8B',
                                            borderRadius: '20px'
                                        }
                                    }>
                                    <option value="">Selecione o curso</option>
                                    <option value="Ciência da Computação">Ciência da Computação</option>
                                    <option value="Engenharia Ambiental">Engenharia Ambiental</option>
                                    <option value="Engenharia Ambiental e Sanitária">
                                        Engenharia Ambiental e Sanitária
                                    </option>
                                    <option value="Engenharia Civil">Engenharia Civil</option>
                                    <option value="Engenharia de Minas">Engenharia de Minas</option>
                                    <option value="Sistemas de Informação">Sistemas de Informação</option>
                                    <option value="nenhum">Nenhum</option>
                                </Form.Select> */}

                                <div className="mb-3">
                                    <InputFlutuante
                                        type="email" id="email" label="Email"
                                        value={dados.email} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante
                                        type="text" id="cpf" label="CPF"
                                        value={dados.cpf} onChange={handleChange}
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

                                <AlertBox
                                    show={show}
                                    message={message}
                                    variant={variant}
                                    key={alertKey}
                                />

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
};

export default Cadastro;