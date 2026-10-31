
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const clientesIniciais = [
    { id: 1, nome: 'Carlos Oliveira', email: 'carlos@email.com', telefone: '(28) 99999-1111', ordens: 3 },
    { id: 2, nome: 'Mariana Santos', email: 'mariana@email.com', telefone: '(28) 99999-2222', ordens: 2 },
    { id: 3, nome: 'Pedro Henrique', email: 'pedro@email.com', telefone: '(28) 99999-3333', ordens: 1 },
    { id: 4, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(28) 99999-4444', ordens: 4 },
]

function Clientes() {
    const [clientes, setClientes] = useState([])
    const [pesquisa, setPesquisa] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarClientes() {
            try {
                const resposta = await apiRequest('/api/Usuario')
                setClientes(resposta)
            } catch (error) {
                console.error(error)
                setErro('Não foi possível carregar os clientes.')
            } finally {
                setCarregando(false)
            }
        }

        carregarClientes()
    }, [])

    return (
        <>
            <div className="welcome">
                <div>
                    <h1>Clientes</h1>
                    <p>Consulte os clientes cadastrados na assistência técnica.</p>
                </div>

                <button className="new-order">
                    + Novo cliente
                </button>
            </div>

            <div className="stats">
                <article className="stat-card">
                    <span>Total de clientes</span>
                    <strong>{clientes.length}</strong>
                    <small>Clientes cadastrados</small>
                </article>

                <article className="stat-card">
                    <span>Total de ordens</span>
                    <strong>{clientes.reduce((total, cliente) => total + cliente.ordens, 0)}</strong>
                    <small>Ordens vinculadas</small>
                </article>
            </div>

            <section className="orders-section">
                <div className="section-heading">
                    <div>
                        <h2>Lista de clientes</h2>
                        <p>Consulte os dados dos seus clientes.</p>
                    </div>
                </div>

                <div className="order-filters">
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou e-mail..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>E-MAIL</th>
                                <th>TELEFONE</th>
                                <th>ORDENS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {carregando ? (
                                <tr>
                                    <td colSpan="4">Carregando clientes...</td>
                                </tr>
                            ) : erro ? (
                                <tr>
                                    <td colSpan="4">{erro}</td>
                                </tr>
                            ) : clientesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="4">Nenhum cliente encontrado.</td>
                                </tr>
                            ) : (
                                clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.email}</td>
                                        <td>Não informado</td>
                                        <td>{cliente.ordens}</td>
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

export default Clientes
