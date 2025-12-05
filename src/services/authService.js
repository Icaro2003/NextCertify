async function login(email, password) {
    const url = "/public/mocks/auth-mock.json";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const user = result.users.find(u => email === u.email && password === u.password);


        if (!user) {
            throw new Error("E-mail ou senha inválido!");
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export default login;