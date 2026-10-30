
const ordens = [
    { id: '#OS-001', cliente: 'Carlos Oliveira', aparelho: 'iPhone 13', defeito: 'Troca de bateria', status: 'Em andamento', valor: 'R$ 250,00' },
    { id: '#OS-002', cliente: 'Mariana Santos', aparelho: 'Samsung Galaxy S22', defeito: 'Tela quebrada', status: 'Aberta', valor: 'R$ 450,00' },
    { id: '#OS-003', cliente: 'Pedro Henrique', aparelho: 'Motorola Edge 40', defeito: 'Problema no carregamento', status: 'Concluída', valor: 'R$ 120,00' },
    { id: '#OS-004', cliente: 'Ana Costa', aparelho: 'iPhone 12', defeito: 'Problema no áudio', status: 'Em andamento', valor: 'R$ 180,00' },
]

function Dashboard() {
    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Visão geral</h1>
                    <p>Acompanhe o desempenho da sua assistência técnica.</p>
                </div>
                <button className="new-order">+ Nova ordem</button>
            </div>

            <div className="stats">
                <article className="stat-card">
                    <span>Total de ordens</span>
                    <strong>128</strong>
                    <small>Ordens cadastradas</small>
                </article>

                <article className="stat-card">
                    <span>Em andamento</span>
                    <strong>24</strong>
                    <small>Reparos em execução</small>
                </article>

                <article className="stat-card">
                    <span>Aguardando atendimento</span>
                    <strong>08</strong>
                    <small>Ordens abertas</small>
                </article>

                <article className="stat-card">
                    <span>Concluídas</span>
                    <strong>96</strong>
                    <small>Reparos finalizados</small>
                </article>
            </div>

            <section className="orders-section">
                <div className="section-heading">
                    <div>
                        <h2>Ordens recentes</h2>
                        <p>Acompanhe as últimas solicitações cadastradas.</p>
                    </div>
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
                            {ordens.map((ordem) => (
                                <tr key={ordem.id}>
                                    <td>{ordem.id}</td>
                                    <td>{ordem.cliente}</td>
                                    <td>{ordem.aparelho}</td>
                                    <td>{ordem.defeito}</td>
                                    <td>
                                        <span className={`status ${ordem.status === 'Concluída' ? 'done' : ordem.status === 'Aberta' ? 'open' : 'progress'}`}>
                                            {ordem.status}
                                        </span>
                                    </td>
                                    <td>{ordem.valor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default Dashboard
