
import { useState } from 'react'
import { apiRequest } from '../services/api'

function Login() {
    const [modoCadastro, setModoCadastro] = useState(false)

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)

    async function entrar(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')
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

    async function cadastrar(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')

        if (senha !== confirmarSenha) {
            setErro('As senhas não são iguais.')
            return
        }

        setCarregando(true)

        try {
            await apiRequest('/api/Usuario/registrar', {
                method: 'POST',
                body: JSON.stringify({ nome, email, senha }),
            })

            setModoCadastro(false)
            setNome('')
            setSenha('')
            setConfirmarSenha('')
            setSucesso('Conta criada! Agora você pode entrar.')
        } catch (error) {
            setErro('Não foi possível criar a conta. Verifique os dados ou se o e-mail já está cadastrado.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <main className="login-page">
            <form
                className="login-card"
                onSubmit={modoCadastro ? cadastrar : entrar}
            >
                <h1>TudoIncluso</h1>

                <p>
                    {modoCadastro
                        ? 'Crie sua conta para começar.'
                        : 'Entre na sua conta para continuar.'}
                </p>

                {modoCadastro && (
                    <>
                        <label>Nome completo</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />
                    </>
                )}

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
                    minLength={6}
                    required
                />

                {modoCadastro && (
                    <>
                        <label>Confirmar senha</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={e => setConfirmarSenha(e.target.value)}
                            required
                        />
                    </>
                )}

                {erro && <p className="login-error">{erro}</p>}
                {sucesso && <p>{sucesso}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando
                        ? 'Aguarde...'
                        : modoCadastro
                            ? 'Criar conta'
                            : 'Entrar'}
                </button>

                <p>
                    {modoCadastro
                        ? 'Já possui uma conta?'
                        : 'Ainda não possui uma conta?'}
                </p>

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={() => {
                        setModoCadastro(!modoCadastro)
                        setErro('')
                        setSucesso('')
                    }}
                >
                    {modoCadastro ? 'Voltar ao login' : 'Criar uma conta'}
                </button>
            </form>
        </main>
    )
}

export default Login
