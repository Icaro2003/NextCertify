import API_URL from "./apiUrl";

const roleService = {
    async listAllUsers(token) {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao carregar usuários.`);
        }
        return await response.json();
    },


    async attributeRole(userId, papel, acao, token) {
        const response = await fetch(`${API_URL}/users/${userId}/atribuir-papel`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "papel": papel,
                "acao": acao
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Falha ao atribuir papel.');
        }

        if (response.status === 204) return null;

        return await response.json();
    },


    async createAlunoProfile(payload, token) {
        const response = await fetch(`${API_URL}/alunos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Falha ao criar perfil de aluno.');
        }
        return await response.json();
    },

    async listCursos(token) {
        const response = await fetch(`${API_URL}/cursos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar cursos.');
        return await response.json();
    }
};

export default roleService;
