
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from './services/api'
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    useLocation,
    Navigate,
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Ordens from './pages/Ordens'
import Servicos from './pages/Servicos'
import Clientes from './pages/Clientes'
import Login from './pages/Login'

import './App.css'

function Layout() {
    const [darkMode, setDarkMode] = useState(false)
    const location = useLocation()
    const [usuario, setUsuario] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const resposta = await apiRequest('/api/Usuario/me')
                setUsuario(resposta)
            } catch (error) {
                console.error('Erro ao carregar perfil:', error)
                sessionStorage.removeItem('token')
                navigate('/login', { replace: true })
            }
        }

        carregarPerfil()
    }, [navigate])
    function sair() {
        sessionStorage.removeItem('token')
        navigate('/login', { replace: true })
    }

    const paginas = {
        '/': 'Painel',
        '/ordens': 'Ordens de serviço',
        '/servicos': 'Catálogo de serviços',
        '/clientes': 'Clientes',

    }



    const paginaAtual = paginas[location.pathname] || 'Painel'

    return (
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-icon">T</div>
                    <div>
                        <h2>TudoIncluso</h2>
                        <span>Assistência técnica</span>
                    </div>
                </div>

                <span className="menu-label">MENU PRINCIPAL</span>

                <nav>
                    <NavLink to="/" end>
                        ▦ <span>Painel</span>
                    </NavLink>

                    <NavLink to="/ordens">
                        ▤ <span>Ordens de serviço</span>
                    </NavLink>

                    <NavLink to="/servicos">
                        ⚙ <span>Catálogo de serviços</span>
                    </NavLink>

                    {usuario?.perfil === 'Admin' && (
                        <NavLink to="/clientes">
                            ♙ <span>Clientes</span>
                        </NavLink>
                    )}
                </nav>

                <div className="sidebar-bottom">
                    <div className="profile">
                        <div className="avatar">
                            {usuario?.nome?.substring(0, 2).toUpperCase() || 'US'}
                        </div>

                        <div>
                            <strong>{usuario?.nome || 'Carregando...'}</strong>
                            <span>{usuario?.perfil || 'Usuário'}</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <span>{paginaAtual}</span>

                    <div className="topbar-actions">
                        <button
                            className="theme-toggle"
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label="Alternar tema"
                        >
                            {darkMode ? '☀️ Modo claro' : '🌙 Modo escuro'}
                        </button>

                        <button className="theme-toggle" onClick={sair}>
                            Sair da conta
                        </button>
                    </div>
                </header>

                <section className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ordens" element={<Ordens />} />
                        <Route path="/servicos" element={<Servicos />} />
                        <Route
                            path="/clientes"
                            element={
                                usuario?.perfil === 'Admin'
                                    ? <Clientes />
                                    : <Navigate to="/" replace />
                            }
                        />
                    </Routes>

                    <footer>
                        TudoIncluso © 2026 — Sistema de gerenciamento de assistência técnica.
                    </footer>
                </section>
            </main>
        </div>
    )
}

function RotasProtegidas() {
    const token = sessionStorage.getItem('token')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <Layout />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<RotasProtegidas />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
