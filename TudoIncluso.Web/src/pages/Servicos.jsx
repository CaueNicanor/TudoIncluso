
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Servicos() {
    const [servicos, setServicos] = useState([])
    const [pesquisa, setPesquisa] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [usuario, setUsuario] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [precoBase, setPrecoBase] = useState('')
    const [erroCadastro, setErroCadastro] = useState('')
    const [editandoId, setEditandoId] = useState(null)

    useEffect(() => {
        async function carregarServicos() {
            try {
                setCarregando(true)
                setErro('')

                const resposta = await apiRequest('/api/ServicoCatalogo')

                setServicos(resposta.dados)
            } catch (error) {
                console.error('Erro ao carregar serviços:', error)
                setErro('Não foi possível carregar os serviços. Tente novamente.')
            } finally {
                setCarregando(false)
            }
        }

        carregarServicos()
    }, [])
    useEffect(() => {
        async function carregarPerfil() {
            try {
                const resposta = await apiRequest('/api/Usuario/me')
                setUsuario(resposta)
            } catch (error) {
                console.error('Erro ao carregar perfil:', error)
            }
        }

        carregarPerfil()
    }, [])


    const servicosFiltrados = servicos.filter((servico) =>
        servico.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )

    async function cadastrarServico(e) {
        e.preventDefault()
        setErroCadastro('')

        try {
            await apiRequest('/api/ServicoCatalogo', {
                method: 'POST',
                body: JSON.stringify({
                    nome,
                    descricao,
                    precoBase: Number(precoBase),
                }),
            })

            setNome('')
            setDescricao('')
            setPrecoBase('')
            setMostrarFormulario(false)

            const resposta = await apiRequest('/api/ServicoCatalogo')
            setServicos(resposta.dados)
        } catch (error) {
            console.error('Erro ao cadastrar serviço:', error)
            setErroCadastro('Não foi possível cadastrar o serviço. Verifique os dados e tente novamente.')
        }
    }

    async function atualizarServico(e) {
        e.preventDefault()
        setErroCadastro('')

        try {
            await apiRequest(`/api/ServicoCatalogo/${editandoId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    nome,
                    descricao,
                    precoBase: Number(precoBase),
                }),
            })

            setEditandoId(null)
            setNome('')
            setDescricao('')
            setPrecoBase('')
            setMostrarFormulario(false)

            const resposta = await apiRequest('/api/ServicoCatalogo')
            setServicos(resposta.dados)
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error)
            setErroCadastro('Não foi possível atualizar o serviço.')
        }
    }
    async function excluirServico(id) {
        const confirmar = window.confirm(
            'Tem certeza de que deseja excluir este serviço?'
        )

        if (!confirmar) return

        try {
            await apiRequest(`/api/ServicoCatalogo/${id}`, {
                method: 'DELETE',
            })

            const resposta = await apiRequest('/api/ServicoCatalogo')
            setServicos(resposta.dados)
        } catch (error) {
            console.error('Erro ao excluir serviço:', error)
            setErroCadastro('Não foi possível excluir o serviço.')
        }
    }

    function iniciarEdicao(servico) {
        setEditandoId(servico.id)
        setNome(servico.nome)
        setDescricao(servico.descricao)
        setPrecoBase(servico.precoBase)
        setErroCadastro('')
        setMostrarFormulario(true)
    }

    const formatarValor = (valor) =>
        valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Catálogo de serviços</h1>
                    <p>Consulte os serviços oferecidos pela assistência técnica.</p>
                </div>
            </div>

            <section className="orders-section">
                <div className="section-heading">
                    <div>
                        <h2>Serviços cadastrados</h2>
                        <p>{servicos.length} serviços encontrados na API.</p>
                    </div>

                    {usuario?.perfil === 'Admin' && (
                        <button onClick={() => {
                            setEditandoId(null)
                            setNome('')
                            setDescricao('')
                            setPrecoBase('')
                            setErroCadastro('')
                            setMostrarFormulario(!mostrarFormulario)
                        }}>
                            + Novo serviço
                        </button>
                    )}
                </div>
                

                <div className="order-filters">
                    <input
                        type="text"
                        placeholder="Pesquisar serviço..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>

                {mostrarFormulario && usuario?.perfil === 'Admin' && (
                    <form
                        onSubmit={editandoId ? atualizarServico : cadastrarServico}
                        className="service-form"
                    >
                        <h3>{editandoId ? 'Editar serviço' : 'Novo serviço'}</h3>

                        <input
                            type="text"
                            placeholder="Nome do serviço"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Preço base"
                            min="0.01"
                            step="0.01"
                            value={precoBase}
                            onChange={(e) => setPrecoBase(e.target.value)}
                            required
                        />

                        {erroCadastro && <p role="alert">{erroCadastro}</p>}

                        <button type="submit">
                            {editandoId ? 'Salvar alterações' : 'Cadastrar serviço'}
                        </button>
                        <button type="button" onClick={() => setMostrarFormulario(false)}>
                            Cancelar
                        </button>
                    </form>
                )}

                {carregando && <p>Carregando serviços...</p>}

                {erro && <p role="alert">{erro}</p>}

                {!carregando && !erro && (
                    <div className="table-container">
                        <table>
                            <thead>
                                                        <tr>
                            <th>ID</th>
                            <th>SERVIÇO</th>
                            <th>DESCRIÇÃO</th>
                            <th>PREÇO BASE</th>
                            {usuario?.perfil === 'Admin' && <th>AÇÕES</th>}
                        </tr>
                            </thead>

                            <tbody>
                                {servicosFiltrados.map((servico) => (
                                    <tr key={servico.id}>
                                        <td>{servico.id}</td>
                                        <td>{servico.nome}</td>
                                        <td>{servico.descricao}</td>
                                        <td>{formatarValor(servico.precoBase)}</td>

                                        {usuario?.perfil === 'Admin' && (
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => iniciarEdicao(servico)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => excluirServico(servico.id)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}

                                {servicosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={usuario?.perfil === 'Admin' ? 5 : 4}>
                                            Nenhum serviço encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    )
}

export default Servicos
