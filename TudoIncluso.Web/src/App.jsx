
import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Ordens from './pages/Ordens'
import Servicos from './pages/Servicos'
import Clientes from './pages/Clientes'
import './App.css'

function Layout() {
    const [darkMode, setDarkMode] = useState(false)
    const location = useLocation()

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

                    <NavLink to="/clientes">
                        ♙ <span>Clientes</span>
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <div className="profile">
                        <div className="avatar">AD</div>
                        <div>
                            <strong>Administrador</strong>
                            <span>Administrador</span>
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

                        <div className="top-user">
                            Administrador <span>▾</span>
                        </div>
                    </div>
                </header>

                <section className="content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ordens" element={<Ordens />} />
                        <Route path="/servicos" element={<Servicos />} />
                        <Route path="/clientes" element={<Clientes />} />
                    </Routes>

                    <footer>
                        TudoIncluso © 2026 — Sistema de gerenciamento de assistência técnica.
                    </footer>
                </section>
            </main>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    )
}

export default App
