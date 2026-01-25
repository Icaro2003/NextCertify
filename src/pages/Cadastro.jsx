import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

import InputFlutuante from '../components/InputFlutuante';
import BotaoPrincipal from '../components/BotaoPrincipal';

import ImagemCadastro from '../img/signin.png';

import AlertBox from '../components/AlertBox';
import useAlert from '../hooks/useAlert';

import '../css/forms.css';
import '../css/form-pages.css';

function Cadastro() {
    const navigate = useNavigate();

    const { show, message, variant, alertKey, handleAlert } = useAlert();

    const [dados, setDados] = useState({
        // Dados do usuário
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        matricula: "",
        cpf: "",

        // Bolsista / Aluno
        anoIngresso: "",
        curso: "",
        semestre: ""
    });

    const handleChange = (e) => {
        setDados({ ...dados, [e.target.id]: e.target.value });
    };

    const registerUser = async () => {
        const payload = {
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            matricula: dados.matricula,
            cpf: dados.cpf,
            status: "ATIVO",
            bolsista: {
                anoIngresso: parseInt(dados.anoIngresso),
                curso: dados.curso
            }
        };

        const response = await fetch("http://localhost:3000/api/users", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        const { semestre } = dados;
        const dadosCadastroNovos = { semestre };

        localStorage.setItem("semestre", JSON.stringify(dadosCadastroNovos));
        console.log(JSON.parse(localStorage.getItem("semestre")));

        if (!response.ok) {
            throw new Error(data.error || "Erro ao cadastrar aluno!");
        }

        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser();
            alert("Cadastro realizado com sucesso! Faça o login.");
            navigate("/");
        } catch (error) {
            handleAlert(error?.message || "Erro ao cadastrar. Tente novamente.");
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

                    <Col lg={6} className="d-flex justify-content-center mb-5 mb-lg-0">
                        <Image
                            src={ImagemCadastro}
                            fluid
                            alt="Ilustração Cadastro"
                            style={{ width: '100%', maxWidth: '550px' }}
                        />
                    </Col>

                    <Col lg={6}>
                        <div className="bg-white px-5 py-3 shadow-lg rounded-4">
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
                                        type="text" id="cpf" label="CPF"
                                        value={dados.cpf} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <div className="label-float">
                                        <Form.Control
                                            type='number'
                                            min={0}
                                            max={new Date().getFullYear()}
                                            id='anoIngresso'
                                            placeholder=" "
                                            required
                                            value={dados.anoIngresso}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor='anoIngresso'>Ano de ingresso</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Form.Select
                                        required
                                        id='semestre'
                                        className='label-float'
                                        value={dados.semestre}
                                        onChange={handleChange}
                                        style={
                                            {
                                                border: '1px solid #8C8B8B',
                                                borderRadius: '20px'
                                            }
                                        }>
                                        <option value="">Selecione o semestre</option>
                                        <option value="1">1º Semestre</option>
                                        <option value="2">2º Semestre</option>
                                    </Form.Select>
                                </div>

                                <div className="mb-3">
                                    <Form.Select
                                        required
                                        id='curso'
                                        className='label-float'
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
                                    </Form.Select>
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante
                                        type="password" id="senha" label="Senha"
                                        value={dados.senha} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
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