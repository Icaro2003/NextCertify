import API_URL from "./apiUrl";

const predefinicoesService = {
    async listTutors(token) {
        const response = await fetch(`${API_URL}/users/tutores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao carregar tutores.`);
        }
        return await response.json();
    },

    async listScholarshipHolders(token) {
        const response = await fetch(`${API_URL}/users/bolsistas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao carregar bolsistas.`);
        }
        return await response.json();
    },

    async listStudents(token) {
        const response = await fetch(`${API_URL}/users/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao carregar usuários para alunos.`);
        }

        const data = await response.json();

        const students = data.filter(
            user =>
                !user.tutor &&
                !user.coordenador
        );

        return students;
    },



    async listPeriodos(token) {
        const response = await fetch(`${API_URL}/periodo-tutoria`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}: Falha ao carregar períodos.`);
        }
        return await response.json();
    },

    async createPeriodo(payload, token) {
        const response = await fetch(`${API_URL}/periodo-tutoria`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao criar período.');
        }
        return await response.json();
    },

    async updatePeriodo(id, payload, token) {
        const response = await fetch(`${API_URL}/periodo-tutoria/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao atualizar período.');
        }
        return await response.json();
    },

    async deletePeriodo(id, token) {
        const response = await fetch(`${API_URL}/periodo-tutoria/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao deletar período.');
        }

        if (response.status === 204) return null;
        return await response.json();
    },

    async saveCargaHoraria(periodoId, categoria, horasMinimas, token) {
        const response = await fetch(`${API_URL}/carga-horaria-minima`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                periodoId,
                categoria,
                horasMinimas: parseInt(horasMinimas)
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao salvar carga horária.');
        }
        return await response.json();
    },

    async listCargasHorarias(periodoId, token) {
        const response = await fetch(`${API_URL}/carga-horaria-minima?periodoId=${periodoId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao carregar cargas horárias.');
        }
        return await response.json();
    },
    async deleteCargaHoraria(id, token) {
        const response = await fetch(`${API_URL}/carga-horaria-minima/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao remover carga horária.');
        }
        return response.status === 204 ? null : await response.json();
    },


    async createVinculo(payload, token) {
        const response = await fetch(`${API_URL}/alocar-tutor-aluno`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao criar vínculo.');
        }
        return await response.json();
    },

    async listVinculos(periodoId, token) {
        const url = periodoId
            ? `${API_URL}/alocar-tutor-aluno?periodoId=${periodoId}`
            : `${API_URL}/alocar-tutor-aluno`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao carregar vínculos.');
        }
        return await response.json();
    },


    async deleteVinculo(id, token) {
        const response = await fetch(`${API_URL}/alocar-tutor-aluno/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao remover vínculo.');
        }

        if (response.status === 204) return null;
        return await response.json();
    }
};

export default predefinicoesService;
