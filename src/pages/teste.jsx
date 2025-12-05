import { Container, Row, Col, Form, Image } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

import InputFlutuante from "../components/InputFlutuante";
import BotaoPrincipal from "../components/BotaoPrincipal";

function Teste() {
    return (
        <>
            <div className="label-float mt-3">
                <Form.Control
                    type='text'
                    id='my-id'
                    placeholder=" "
                />
                <label htmlFor='my-id'>Minha label</label>
            </div>;
        </>
    );
}

export default Teste;