
const API_URL = 'https://tudoincluso-api.onrender.com'

export async function apiRequest(endpoint, options = {}) {
    const token = sessionStorage.getItem('token')

    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })

    if (!resposta.ok) {
        const erro = await resposta.text()
        throw new Error(erro || `Erro HTTP: ${resposta.status}`)
    }

    if (resposta.status === 204) {
        return null
    }

    return resposta.json()
}
