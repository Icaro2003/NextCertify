import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useAuthenticatedUser() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(() => {
        try {
            const usuarioLogado = localStorage.getItem("user");

            return usuarioLogado ? JSON.parse(usuarioLogado) : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    });

    useEffect(() => {
        if (!usuario) {
            navigate("/");
        }
    }, [usuario, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        setUsuario(null);
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
        token: localStorage.getItem("token"),
        userRole,
        handleLogout
    };

    return userAuthenticatedProps;
}

export default useAuthenticatedUser;
