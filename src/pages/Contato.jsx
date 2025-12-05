import { useState } from 'react';
import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import InputFlutuante from '../components/InputFlutuante';
import BotaoPrincipal from '../components/BotaoPrincipal';

import ContactImage from '../img/contact.png';

function Contato() {
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        nome: '',
        email: '',
        mensagem: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Mensagem enviada com sucesso! Obrigado, ${form.nome}.`);
        navigate('/');
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f8f9fa',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between' 
        }}>
            
            <Container className="d-flex align-items-center justify-content-center flex-grow-1 py-5">
                <Row className="w-100 align-items-center">
                    
                    <Col lg={6} className="d-none d-lg-flex justify-content-center mb-5 mb-lg-0">
                        <Image 
                            src={ContactImage} 
                            fluid 
                            alt="Ilustração Contato" 
                            style={{ maxWidth: '86%' }} 
                        />
                    </Col>

                    <Col lg={6}>
                        <div className="bg-white p-5 shadow-lg rounded-4 border">
                            <Form className="w-100" onSubmit={handleSubmit}>
                                
                                <h2 className="text-primary fw-bold mb-4">Contate-nos</h2>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="text" id="nome" label="Seu Nome"
                                        value={form.nome} onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <InputFlutuante 
                                        type="email" id="email" label="Email"
                                        value={form.email} onChange={handleChange}
                                    />
                                </div>

                                <div className="label-float mt-3 mb-4">
                                    <Form.Control 
                                        as="textarea"
                                        id="mensagem" 
                                        placeholder=" " 
                                        required 
                                        value={form.mensagem}
                                        onChange={handleChange}
                                        style={{ height: '150px', resize: 'none' }}
                                    />
                                    <label htmlFor="mensagem">Sua Mensagem</label>
                                </div>

                                <div className="py-2">
                                     <BotaoPrincipal texto="Enviar Mensagem" type="submit" />
                                </div>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            <footer style={{ 
                background: 'linear-gradient(90deg, #005bea 0%, #00c6fb 100%)',
                padding: '40px 0',
                color: 'white',
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: '500'
            }}>
                <Container>
                    <h5 className="mb-0">© 2025 - NextCertify</h5>
                </Container>
            </footer>

        </div>
    );
}

export default Contato;