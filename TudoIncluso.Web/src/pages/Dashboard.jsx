
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Dashboard() {
    const [ordens, setOrdens] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarOrdens() {
            try {
                const resposta = await apiRequest('/api/OrdemServico')
                setOrdens(resposta.dados || resposta || [])
            } catch (error) {
                console.error('Erro ao carregar ordens:', error)
                setErro('Não foi possível carregar as ordens.')
            } finally {
                setCarregando(false)
            }
        }

        carregarOrdens()
    }, [])

    const total = ordens.length
    const andamento = ordens.filter(o => o.status === 'Em andamento').length
    const abertas = ordens.filter(o => o.status === 'Aberta').length
    const concluidas = ordens.filter(o => o.status === 'Concluida').length

    const recentes = [...ordens]
        .sort((a, b) => new Date(b.dataEntrada) - new Date(a.dataEntrada))
        .slice(0, 5)

    function formatarValor(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    function formatarStatus(status) {
        return status === 'Concluida' ? 'Concluída' : status
    }

    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Visão geral</h1>
                    <p>Acompanhe o desempenho da sua assistência técnica.</p>
                </div>
            </div>

            {erro && <p>{erro}</p>}

            <div className="stats">
                <article className="stat-card">
                    <span>Total de ordens</span>
                    <strong>{carregando ? '...' : total}</strong>
                    <small>Ordens cadastradas</small>
                </article>

                <article className="stat-card">
                    <span>Em andamento</span>
                    <strong>{carregando ? '...' : andamento}</strong>
                    <small>Reparos em execução</small>
                </article>

                <article className="stat-card">
                    <span>Aguardando atendimento</span>
                    <strong>{carregando ? '...' : abertas}</strong>
                    <small>Ordens abertas</small>
                </article>

                <article className="stat-card">
                    <span>Concluídas</span>
                    <strong>{carregando ? '...' : concluidas}</strong>
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
                            {carregando ? (
                                <tr>
                                    <td colSpan="6">Carregando ordens...</td>
                                </tr>
                            ) : recentes.length === 0 ? (
                                <tr>
                                    <td colSpan="6">Nenhuma ordem cadastrada.</td>
                                </tr>
                            ) : (
                                recentes.map(ordem => (
                                    <tr key={ordem.id}>
                                        <td>OS-{String(ordem.id).padStart(3, '0')}</td>
                                        <td>{ordem.usuario?.nome || ordem.cliente?.nome || 'Não informado'}</td>
                                        <td>{ordem.modeloCelular}</td>
                                        <td>{ordem.defeitoRelatado}</td>
                                        <td>
                                            <span className={`status ${ordem.status === 'Concluida' ? 'done' :
                                                    ordem.status === 'Aberta' ? 'open' : 'progress'
                                                }`}>
                                                {formatarStatus(ordem.status)}
                                            </span>
                                        </td>
                                        <td>{formatarValor(ordem.orcamento)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default Dashboard
