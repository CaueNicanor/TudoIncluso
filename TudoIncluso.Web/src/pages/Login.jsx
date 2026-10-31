
import { useState } from 'react'
import { apiRequest } from '../services/api'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)

    async function entrar(e) {
        e.preventDefault()
        setErro('')
        setCarregando(true)

        try {
            const resposta = await apiRequest('/api/Usuario/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
            })

            sessionStorage.setItem('token', resposta.token)
            window.location.href = '/'
        } catch (error) {
            setErro('Não foi possível entrar. Verifique seu e-mail e senha.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={entrar}>
                <h1>TudoIncluso</h1>
                <p>Entre na sua conta para continuar.</p>

                <label>E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label>Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                />

                {erro && <p className="login-error">{erro}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </main>
    )
}

export default Login
