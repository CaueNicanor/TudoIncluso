
import { useState } from 'react'

const ordensIniciais = [
    { id: '#OS-001', cliente: 'Carlos Oliveira', aparelho: 'iPhone 13', defeito: 'Troca de bateria', status: 'Em andamento', valor: 250 },
    { id: '#OS-002', cliente: 'Mariana Santos', aparelho: 'Samsung Galaxy S22', defeito: 'Tela quebrada', status: 'Aberta', valor: 450 },
    { id: '#OS-003', cliente: 'Pedro Henrique', aparelho: 'Motorola Edge 40', defeito: 'Problema no carregamento', status: 'Concluída', valor: 120 },
    { id: '#OS-004', cliente: 'Ana Costa', aparelho: 'iPhone 12', defeito: 'Problema no áudio', status: 'Em andamento', valor: 180 },
]

function Ordens() {
    const [ordens] = useState(ordensIniciais)
    const [pesquisa, setPesquisa] = useState('')
    const [filtro, setFiltro] = useState('Todas')

    const ordensFiltradas = ordens.filter((ordem) => {
        const correspondePesquisa =
            ordem.id.toLowerCase().includes(pesquisa.toLowerCase()) ||
            ordem.cliente.toLowerCase().includes(pesquisa.toLowerCase()) ||
            ordem.aparelho.toLowerCase().includes(pesquisa.toLowerCase())

        const correspondeFiltro =
            filtro === 'Todas' || ordem.status === filtro

        return correspondePesquisa && correspondeFiltro
    })

    const formatarValor = (valor) =>
        valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Ordens de serviço</h1>
                    <p>Gerencie e acompanhe os reparos dos aparelhos.</p>
                </div>

                <button className="new-order">
                    + Nova ordem
                </button>
            </div>

            <div className="stats">
                <article className="stat-card">
                    <span>Total de ordens</span>
                    <strong>{ordens.length}</strong>
                    <small>Ordens cadastradas</small>
                </article>

                <article className="stat-card">
                    <span>Em andamento</span>
                    <strong>{ordens.filter(o => o.status === 'Em andamento').length}</strong>
                    <small>Reparos em execução</small>
                </article>

                <article className="stat-card">
                    <span>Abertas</span>
                    <strong>{ordens.filter(o => o.status === 'Aberta').length}</strong>
                    <small>Aguardando atendimento</small>
                </article>

                <article className="stat-card">
                    <span>Concluídas</span>
                    <strong>{ordens.filter(o => o.status === 'Concluída').length}</strong>
                    <small>Reparos finalizados</small>
                </article>
            </div>

            <section className="orders-section">
                <div className="section-heading">
                    <div>
                        <h2>Lista de ordens</h2>
                        <p>Consulte as solicitações cadastradas.</p>
                    </div>
                </div>

                <div className="order-filters">
                    <input
                        type="text"
                        placeholder="Pesquisar por ordem, cliente ou aparelho..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />

                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    >
                        <option value="Todas">Todos os status</option>
                        <option value="Aberta">Aberta</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDEM</th>
                                <th>CLIENTE</th>
                                <th>APARELHO</th>
                                <th>DEFEITO</th>
                                <th>STATUS</th>
                                <th>VALOR</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordensFiltradas.map((ordem) => (
                                <tr key={ordem.id}>
                                    <td>{ordem.id}</td>
                                    <td>{ordem.cliente}</td>
                                    <td>{ordem.aparelho}</td>
                                    <td>{ordem.defeito}</td>
                                    <td>
                                        <span className={`status ${ordem.status === 'Concluída'
                                                ? 'done'
                                                : ordem.status === 'Aberta'
                                                    ? 'open'
                                                    : 'progress'
                                            }`}>
                                            {ordem.status}
                                        </span>
                                    </td>
                                    <td>{formatarValor(ordem.valor)}</td>
                                </tr>
                            ))}

                            {ordensFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        Nenhuma ordem encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default Ordens
