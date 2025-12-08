import { getData } from "./api";

async function login(email, password) {
    const url = "/mocks/auth-mock.json";

    const data = await getData(url);

    // Código adicionado para testes no localStore de Cadastro e Login 
    // Pode remover depois dos testes de localStorage
    const localUsers = JSON.parse(localStorage.getItem("usuarios")) || [];
    const allUsers = [...data.users, ...localUsers];

    const user = allUsers.find(u => email === u.email && password === u.password);
    //const user = data.users.find(u => email === u.email && password === u.password);

    if (!user) {
        throw new Error("E-mail ou senha inválido!");
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    return user;
}


async function register(name, matricula, email, password){
    const url = "/mocks/auth-mock.json";

    const data = await getData(url);

    //Incluindo os usuários do localStorage na verificação
    const localUsers = JSON.parse(localStorage.getItem("usuarios")) || [];
    const allUsers = [...data.users, ...localUsers];
    const exists = allUsers.some(u => u.email === email);

    //const exists = data.users.some(u => u.email === email);

    if (exists){
        throw new Error("E-mail já cadastrado!");
    }

    const id = (allUsers.reduce((max, u) => Math.max(max, u.id || 0),0)) + 1;
    const newUser = { id, name, matricula, email, password, role: "aluno" };

    // Salvando Localmente para realizar testes de cadastro  --- Germano
    // Não apagar por enquanto por favor, quem for mexer
    const usuarios = localUsers;
    const emailExistsLocal = usuarios.some(u => u.email === email);

    if(emailExistsLocal) {
        throw new Error("E-mail já cadastrado!");
    }

    usuarios.push(newUser);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return newUser;
}

export default login;
export { register };