import API_URL_BASE from "./apiUrl";

const API_URL = `${API_URL_BASE}/certificates`;

const certificateService = {
    async listCertificates(userId, token) {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Não foi possível carregar os certificados.');
        const data = await response.json();
        return data.certificates || [];
    },

    async uploadCertificate(formData, token) {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is set automatically for FormData
            },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Falha ao enviar o certificado.');
        }
        return await response.json();
    },

    async deleteCertificate(id, token) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao excluir o certificado.');
        return true;
    },

    async downloadCertificate(id, token) {
        const response = await fetch(`${API_URL}/${id}/download`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Falha ao baixar o certificado.');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificado-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    },

    async listAllCertificates(token, status = '') {
        const url = status ? `${API_URL}?status=${status}` : API_URL;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Não foi possível carregar os certificados.');
        const data = await response.json();
        return data.certificates || [];
    },

    async updateCertificateStatus(id, status, adminComments, token) {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, adminComments })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Falha ao atualizar o status do certificado.');
        }
        return await response.json();
    }
};


export default certificateService;
