import API_URL from "./apiUrl";

const avaliacaoTutoriaService = {
    async listActivePeriods(token) {
        const response = await fetch(`${API_URL}/periodo-tutoria`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar os períodos.');
        }

        const data = await response.json();
        return data.periodos || [];
    },

    async createAvaliacaoTutoria(payload, token) {
        const response = await fetch(`${API_URL}/avaliacao-tutoria`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Não foi possível criar a avaliação.');
        }


        const data = await response.json();
        return data;
    }
};

export default avaliacaoTutoriaService;