
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Ordens() {
    const [ordens, setOrdens] = useState([])
    const [pesquisa, setPesquisa] = useState('')
    const [filtro, setFiltro] = useState('Todas')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [modeloCelular, setModeloCelular] = useState('')
    const [defeitoRelatado, setDefeitoRelatado] = useState('')
    const [orcamento, setOrcamento] = useState('')
    const [erroCadastro, setErroCadastro] = useState('')
    const [ordemSelecionada, setOrdemSelecionada] = useState(null)
    const [reparos, setReparos] = useState([])
    const [carregandoReparos, setCarregandoReparos] = useState(false)
    const [erroReparos, setErroReparos] = useState('')
    const [mostrarFormularioReparo, setMostrarFormularioReparo] = useState(false)
    const [descricaoReparo, setDescricaoReparo] = useState('')
    const [valorReparo, setValorReparo] = useState('')
    const [erroCadastroReparo, setErroCadastroReparo] = useState('')

    useEffect(() => {
        async function carregarOrdens() {
            try {
                setCarregando(true)
                setErro('')

                const resposta = await apiRequest('/api/OrdemServico')
                setOrdens(resposta.dados || [])
            } catch (error) {
                console.error('Erro ao carregar ordens:', error)
                setErro('Não foi possível carregar as ordens de serviço.')
            } finally {
                setCarregando(false)
            }
        }

        carregarOrdens()
    }, [])

    const normalizarStatus = (status) =>
        status === 'Concluida' ? 'Concluída' : status

    const ordensFiltradas = ordens.filter((ordem) => {
        const termo = pesquisa.toLowerCase()

        const correspondePesquisa =
            String(ordem.id).includes(termo) ||
            ordem.modeloCelular.toLowerCase().includes(termo) ||
            ordem.defeitoRelatado.toLowerCase().includes(termo)

        const correspondeFiltro =
            filtro === 'Todas' ||
            normalizarStatus(ordem.status) === filtro

        return correspondePesquisa && correspondeFiltro
    })

    const formatarValor = (valor) =>
        (valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    const formatarData = (data) =>
        new Date(data).toLocaleDateString('pt-BR')

    async function cadastrarOrdem(e) {
        e.preventDefault()
        setErroCadastro('')

        try {
            await apiRequest('/api/OrdemServico', {
                method: 'POST',
                body: JSON.stringify({
                    modeloCelular,
                    defeitoRelatado,
                    orcamento: Number(orcamento),
                }),
            })

            const resposta = await apiRequest('/api/OrdemServico')
            setOrdens(resposta.dados || [])

            setModeloCelular('')
            setDefeitoRelatado('')
            setOrcamento('')
            setMostrarFormulario(false)
        } catch (error) {
            console.error('Erro ao cadastrar ordem:', error)
            setErroCadastro('Não foi possível cadastrar a ordem. Verifique os dados.')
        }
    }

    async function atualizarStatus(id, novoStatus) {
        try {
            await apiRequest(`/api/OrdemServico/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: novoStatus,
                }),
            })

            const resposta = await apiRequest('/api/OrdemServico')
            setOrdens(resposta.dados || [])
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            alert('Não foi possível atualizar o status da ordem.')
        }
    }

    async function visualizarReparos(ordemId) {
        if (ordemSelecionada === ordemId) {
            setOrdemSelecionada(null)
            return
        }

        try {
            setCarregandoReparos(true)
            setErroReparos('')
            setOrdemSelecionada(ordemId)

            const resposta = await apiRequest(
                `/api/ServicoReparo/ordem/${ordemId}`
            )

            setReparos(resposta || [])
        } catch (error) {
            console.error('Erro ao carregar reparos:', error)
            setErroReparos('Não foi possível carregar os reparos.')
            setReparos([])
        } finally {
            setCarregandoReparos(false)
        }
    }

    async function cadastrarReparo(e) {
        e.preventDefault()
        setErroCadastroReparo('')

        try {
            console.log('Ordem selecionada:', ordemSelecionada)
            console.log('Dados do reparo:', {
                descricao: descricaoReparo,
                valor: Number(valorReparo),
                ordemServicoId: ordemSelecionada
            })

            await apiRequest('/api/ServicoReparo', {
                method: 'POST',
                body: JSON.stringify({
                    descricao: descricaoReparo,
                    valor: Number(valorReparo),
                    ordemServicoId: ordemSelecionada
                })
            })

            setDescricaoReparo('')
            setValorReparo('')
            setMostrarFormularioReparo(false)

            await visualizarReparos(ordemSelecionada)

        }  catch (error) {
            console.error('Erro ao cadastrar reparo:', error)
            setErroCadastroReparo(error.message)
        }
    }

    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Ordens de serviço</h1>
                    <p>Gerencie e acompanhe os reparos dos aparelhos.</p>
                </div>

                <button
                    className="new-order"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    {mostrarFormulario ? 'Cancelar' : '+ Nova ordem'}
                </button>
            </div>

            {mostrarFormulario && (
                <section className="orders-section">
                    <div className="section-heading">
                        <div>
                            <h2>Nova ordem de serviço</h2>
                            <p>Preencha os dados do aparelho e do reparo.</p>
                        </div>
                    </div>

                    <form onSubmit={cadastrarOrdem} className="order-form">
                        <label>Modelo do celular</label>
                        <input
                            type="text"
                            placeholder="Ex.: iPhone 15"
                            value={modeloCelular}
                            onChange={e => setModeloCelular(e.target.value)}
                            required
                        />

                        <label>Defeito relatado</label>
                        <input
                            type="text"
                            placeholder="Ex.: Tela quebrada"
                            value={defeitoRelatado}
                            onChange={e => setDefeitoRelatado(e.target.value)}
                            required
                        />

                        <label>Orçamento (R$)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex.: 250"
                            value={orcamento}
                            onChange={e => setOrcamento(e.target.value)}
                            required
                        />

                        {erroCadastro && (
                            <p className="login-error">{erroCadastro}</p>
                        )}

                        <button type="submit">
                            Cadastrar ordem
                        </button>
                    </form>
                </section>
            )}

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
                    <strong>{ordens.filter(o =>
                        normalizarStatus(o.status) === 'Concluída'
                    ).length}</strong>
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
                        placeholder="Pesquisar por ordem, aparelho ou defeito..."
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
                                <th>APARELHO</th>
                                <th>DEFEITO</th>
                                <th>STATUS</th>
                                <th>ORÇAMENTO</th>
                                <th>ENTRADA</th>
                            </tr>
                        </thead>

                        <tbody>
                            {carregando ? (
                                <tr>
                                    <td colSpan="6">Carregando ordens...</td>
                                </tr>
                            ) : erro ? (
                                <tr>
                                    <td colSpan="6">{erro}</td>
                                </tr>
                            ) :
                                ordensFiltradas.map((ordem) => (
                                    <>
                                        <tr key={ordem.id}>
                                            <td>OS-{String(ordem.id).padStart(3, '0')}</td>
                                            <td>{ordem.modeloCelular}</td>
                                            <td>{ordem.defeitoRelatado}</td>
                                            <td>
                                                <select
                                                    value={ordem.status}
                                                    onChange={(e) => atualizarStatus(ordem.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="Aberta">Aberta</option>
                                                    <option value="Em andamento">Em andamento</option>
                                                    <option value="Concluida">Concluída</option>
                                                    <option value="Cancelada">Cancelada</option>
                                                </select>
                                            </td>
                                            <td>{formatarValor(ordem.orcamento)}</td>
                                            <td>{formatarData(ordem.dataEntrada)}</td>
                                            <td>
                                                <button
                                                    className="new-order"
                                                    onClick={() => visualizarReparos(ordem.id)}
                                                >
                                                    {ordemSelecionada === ordem.id
                                                        ? 'Fechar'
                                                        : 'Ver reparos'}
                                                </button>
                                            </td>
                                        </tr>

                                        {ordemSelecionada === ordem.id && (
                                            <tr key={`reparos-${ordem.id}`}>
                                                <td colSpan="7">
                                                    <button
                                                        className="new-order"
                                                        onClick={() => setMostrarFormularioReparo(!mostrarFormularioReparo)}
                                                    >
                                                        {mostrarFormularioReparo ? 'Cancelar' : 'Adicionar reparo'}
                                                    </button>

                                                    {mostrarFormularioReparo && (
                                                        <form className="order-form" onSubmit={cadastrarReparo}>
                                                            <label>Descrição do reparo</label>
                                                            <input
                                                                type="text"
                                                                value={descricaoReparo}
                                                                onChange={(e) => setDescricaoReparo(e.target.value)}
                                                                placeholder="Ex.: Troca de tela"
                                                                required
                                                            />

                                                            <label>Valor (R$)</label>
                                                            <input
                                                                type="number"
                                                                min="0.01"
                                                                step="0.01"
                                                                value={valorReparo}
                                                                onChange={(e) => setValorReparo(e.target.value)}
                                                                placeholder="Ex.: 250"
                                                                required
                                                            />

                                                            {erroCadastroReparo && <p>{erroCadastroReparo}</p>}

                                                            <button type="submit">Salvar reparo</button>
                                                        </form>
                                                    )}

                                                    {carregandoReparos ? (
                                                        <p>Carregando reparos...</p>
                                                    ) : erroReparos ? (
                                                        <p>{erroReparos}</p>
                                                    ) : reparos.length === 0 ? (
                                                        <p>Nenhum reparo cadastrado nesta ordem.</p>
                                                    ) : (
                                                        <ul>
                                                            {reparos.map((reparo) => (
                                                                <li key={reparo.id}>
                                                                    {reparo.descricao} — {formatarValor(reparo.valor)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))


                            }
                            {!carregando && !erro && ordensFiltradas.length === 0 && (
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
