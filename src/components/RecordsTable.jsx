import { Table, Button } from "react-bootstrap";
import { TbReport } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function RecordsTable({ user, route }) {
    const navigate = useNavigate();

    const theadPrimary = {
        background: 'var(--bs-primary)',
        color: 'white'
    };

    return (
        <Table hover responsive className="text-center">
            <thead>
                <tr>
                    <th style={theadPrimary}>#</th>
                    <th style={theadPrimary}>Nome</th>
                    <th style={theadPrimary}>E-mail</th>
                    <th style={theadPrimary}>Matrícula</th>
                    <th style={theadPrimary}>Semestre</th>
                    <th style={theadPrimary}>Ações</th>
                </tr>
            </thead>
            <tbody>
                {
                    user.map((u, index) => (
                        <tr key={u.id}>
                            <td>{index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.matricula}</td>
                            <td>{u.semestre}</td>
                            {/* <td>{u.certificados}</td> */}
                            <td>
                                <Button
                                    variant="primary"
                                    className="px-4 py-2 w-100 d-flex justify-content-center align-items-center gap-1"
                                    onClick={() => navigate(route)} // Link para página de relatório individual, carregando informação do aluno selecionado
                                >
                                    <TbReport size={25} className="text-light" />
                                    <span>Gerar relatório</span>
                                </Button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    );
}

export default RecordsTable;