import API_URL from "./apiUrl";

const formAcompanhamentoService = {
    async createForm(payload, token) {
        const response = await fetch(`${API_URL}/form-acompanhamento`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha ao salvar o formulário de acompanhamento.');
        }

        return await response.json();
    },

    async listByTutor(tutorId, token) {
        // Nota: O backend pode precisar de filtros específicos para listagem por tutor
        const response = await fetch(`${API_URL}/form-acompanhamento?tutorId=${tutorId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar formulários.');
        }

        return await response.json();
    }
};

export default formAcompanhamentoService;
