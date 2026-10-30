
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

function Servicos() {
    const [servicos, setServicos] = useState([])
    const [pesquisa, setPesquisa] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

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

    const servicosFiltrados = servicos.filter((servico) =>
        servico.nome.toLowerCase().includes(pesquisa.toLowerCase())
    )

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
                </div>

                <div className="order-filters">
                    <input
                        type="text"
                        placeholder="Pesquisar serviço..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>

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
                                </tr>
                            </thead>

                            <tbody>
                                {servicosFiltrados.map((servico) => (
                                    <tr key={servico.id}>
                                        <td>{servico.id}</td>
                                        <td>{servico.nome}</td>
                                        <td>{servico.descricao}</td>
                                        <td>{formatarValor(servico.precoBase)}</td>
                                    </tr>
                                ))}

                                {servicosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="4">
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
