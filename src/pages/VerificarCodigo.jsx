import { useState, useRef } from 'react';
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import BotaoPrincipal from '../components/BotaoPrincipal';

// CSS (O mesmo das outras)
import '../css/form-pages.css';
import '../css/forms.css';

function VerificarCodigo() {
    const navigate = useNavigate();
    
    // Estado para guardar os 4 dígitos separadamente
    const [codigos, setCodigos] = useState(['', '', '', '']);
    
    // Referências para focar automaticamente no próximo input
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleChange = (index, value) => {
        // Aceita apenas números
        if (isNaN(value)) return;

        const novoCodigo = [...codigos];
        novoCodigo[index] = value;
        setCodigos(novoCodigo);

        // Se digitou um número e não é o último campo, pula para o próximo
        if (value !== '' && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Se apertar Backspace e o campo estiver vazio, volta para o anterior
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
        alert("Código verificado! Redefina sua senha.");
        // Aqui você mandaria para a tela de criar nova senha
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
            <Container style={{ maxWidth: '600px' }}> {/* Card mais estreito */}
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <div className="bg-white p-5 shadow-lg rounded-4 text-center">
                            <Form onSubmit={handleSubmit}>
                                
                                <h2 className="text-primary fw-bold mb-3">Verifique o código<br/>no e-mail</h2>
                                <p className="mb-5 text-muted">
                                    Informe o código de 4 dígitos que foi enviado no seu e-mail
                                </p>

                                {/* AS 4 CAIXINHAS */}
                                <div className="d-flex justify-content-center gap-3 mb-5">
                                    {codigos.map((digit, index) => (
                                        <Form.Control
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            maxLength={1} // Só aceita 1 número
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

                                {/* Botão Principal */}
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