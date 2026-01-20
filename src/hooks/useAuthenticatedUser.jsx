import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useAuthenticatedUser() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (usuarioLogado) {
            setUsuario(usuarioLogado);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const userRole = (role) => {
        const roleNames = {
            student: "Aluno",
            scholarship_holder: "Bolsista",
            tutor: "Tutor",
            coordinator: "Coordenador"
        };

        return roleNames[role];
    };


    const userAuthenticatedProps = {
        usuario,
        userRole,
        handleLogout
    };

    return userAuthenticatedProps;
}

export default useAuthenticatedUser;
