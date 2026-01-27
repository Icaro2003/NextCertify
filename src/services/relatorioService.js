import API_URL from './apiUrl';

const relatorioService = {
    async getRelatorioIndividualAluno(id, token) {
        const response = await fetch(`${API_URL}/relatorios/individual/aluno/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao carregar relatório do aluno');
        }
        return await response.json();
    },

    async getRelatorioIndividualTutor(id, token) {
        const response = await fetch(`${API_URL}/relatorios/individual/tutor/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao carregar relatório do tutor');
        }
        return await response.json();
    }
};

export default relatorioService;
