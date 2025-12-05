import { useState, useRef } from 'react';
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import BotaoPrincipal from '../components/BotaoPrincipal';

function VerificarCodigo() {
    const navigate = useNavigate();
    
    const [codigos, setCodigos] = useState(['', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const novoCodigo = [...codigos];
        novoCodigo[index] = value;
        setCodigos(novoCodigo);

        if (value !== '' && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && codigos[index] === '' && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const codigoFinal = codigos.join('');
        
        if (codigoFinal.length < 4) {
            alert("Digite os 4 dígitos!");
            return;
        }
        
        console.log("Código digitado:", codigoFinal);
        alert("Código verificado com sucesso! (Simulação)");
        
        navigate('/'); 
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
            <Container style={{ maxWidth: '600px' }}>
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <div className="bg-white p-5 shadow-lg rounded-4 text-center">
                            <Form onSubmit={handleSubmit}>
                                
                                <h2 className="text-primary fw-bold mb-3">Verifique o código<br/>no e-mail</h2>
                                <p className="mb-5 text-muted">
                                    Informe o código de 4 dígitos que foi enviado no seu e-mail
                                </p>

                                <div className="d-flex justify-content-center gap-3 mb-5">
                                    {codigos.map((digit, index) => (
                                        <Form.Control
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="form-control shadow-sm border"
                                            style={{ 
                                                width: '70px', 
                                                height: '70px', 
                                                textAlign: 'center', 
                                                fontSize: '2rem',
                                                fontWeight: 'bold',
                                                borderRadius: '15px'
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="py-2">
                                    <BotaoPrincipal 
                                        texto="Enviar" 
                                        type="submit" 
                                    />
                                </div>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VerificarCodigo;