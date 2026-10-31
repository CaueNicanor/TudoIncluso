# TudoIncluso

Sistema de gerenciamento para uma assistência técnica de celulares, desenvolvido como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.

## Sobre o projeto

O TudoIncluso é uma aplicação web para auxiliar no gerenciamento de ordens de serviço de uma assistência técnica. O sistema permite cadastrar clientes, registrar aparelhos e defeitos, acompanhar o andamento dos reparos e administrar os serviços oferecidos pela assistência.

## Tecnologias utilizadas

### Backend
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core 10
- PostgreSQL (Neon)
- JWT para autenticação
- BCrypt para criptografia de senhas
- Swagger para documentação da API

### Frontend
- React
- Vite
- JavaScript
- CSS

### Testes e infraestrutura
- xUnit
- Docker
- GitHub Actions
- Render

## Links do projeto

- **Frontend:** https://tudoincluso.onrender.com
- **API:** https://tudoincluso-api.onrender.com
- **Swagger:** https://tudoincluso-api.onrender.com/swagger
- **Repositório:** https://github.com/CaueNicanor/TudoIncluso

## Funcionalidades

- Cadastro e autenticação de usuários.
- Autenticação por token JWT.
- Controle de acesso por perfil: Administrador e Cliente.
- Cadastro, consulta, atualização e exclusão de ordens de serviço.
- Associação de ordens de serviço aos respectivos clientes.
- Gerenciamento dos serviços realizados em cada ordem.
- Catálogo público de serviços da assistência.
- Gerenciamento administrativo do catálogo.
- Atualização do status das ordens de serviço.
- Paginação e pesquisa de registros.
- Validação de dados e tratamento padronizado de erros.
- Documentação da API com Swagger.

## Como executar localmente

### Pré-requisitos

- .NET 10 SDK
- Node.js e npm
- PostgreSQL ou uma instância PostgreSQL compatível

### Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/CaueNicanor/TudoIncluso.git
   ```

2. Entre na pasta do projeto:
   ```bash
   cd TudoIncluso/TudoIncluso
   ```

3. Configure a variável de ambiente `ConnectionStrings__DefaultConnection` com a conexão do PostgreSQL.

4. Configure também as variáveis de autenticação e criação inicial do administrador:
   - `Jwt__Key`
   - `AdminInicial__Nome`
   - `AdminInicial__Email`
   - `AdminInicial__Senha`

5. Execute a aplicação:
   ```bash
   dotnet restore
   dotnet run
   ```

A documentação Swagger estará disponível no endereço local indicado pela aplicação.

### Frontend

Em outro terminal:

1. Entre na pasta:
   ```bash
   cd TudoIncluso/TudoIncluso.Web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a variável `VITE_API_URL` com o endereço da API.

4. Inicie o frontend:
   ```bash
   npm run dev
   ```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `ConnectionStrings__DefaultConnection` | Conexão com o banco PostgreSQL |
| `Jwt__Key` | Chave utilizada para assinatura dos tokens JWT |
| `AdminInicial__Nome` | Nome do administrador inicial |
| `AdminInicial__Email` | E-mail do administrador inicial |
| `AdminInicial__Senha` | Senha do administrador inicial |
| `Cors__Origens` | Origens autorizadas para acesso à API |
| `VITE_API_URL` | Endereço da API utilizado pelo frontend |

**Importante:** não publique senhas, tokens ou strings de conexão reais no repositório.

## Principais rotas da API

### Usuários — `/api/Usuario`

| Método | Rota | Permissão |
|---|---|---|
| POST | `/api/Usuario/registrar` | Pública |
| POST | `/api/Usuario/login` | Pública |
| GET | `/api/Usuario/me` | Autenticado |
| GET | `/api/Usuario` | Administrador |

### Ordens de serviço — `/api/OrdemServico`

As operações de ordens de serviço exigem autenticação. Clientes podem acessar suas próprias ordens, enquanto o administrador possui acesso administrativo.

| Método | Operação |
|---|---|
| GET | Listar ordens |
| GET | Consultar ordem por ID |
| POST | Criar ordem |
| PUT | Atualizar ordem |
| DELETE | Excluir ordem |
| PATCH | Atualizar status da ordem |

A atualização de status é restrita ao administrador.

### Serviços de reparo — `/api/ServicoReparo`

As operações são autenticadas e respeitam as permissões de acesso à ordem correspondente.

| Método | Operação |
|---|---|
| GET | Consultar serviços de uma ordem |
| POST | Adicionar serviço a uma ordem |
| PUT | Atualizar serviço |
| DELETE | Excluir serviço |

### Catálogo de serviços — `/api/ServicoCatalogo`

| Método | Operação | Permissão |
|---|---|---|
| GET | Listar serviços | Pública |
| GET | Consultar serviço por ID | Pública |
| POST | Cadastrar serviço | Administrador |
| PUT | Atualizar serviço | Administrador |
| DELETE | Excluir serviço | Administrador |

## Regras de negócio e tratamento de erros

A API realiza validações antes de persistir os dados e utiliza respostas HTTP adequadas para diferentes situações:

- `400 Bad Request`: dados inválidos.
- `401 Unauthorized`: usuário não autenticado.
- `403 Forbidden`: usuário sem permissão.
- `404 Not Found`: recurso não encontrado.
- `409 Conflict`: conflito com uma regra de negócio.
- `500 Internal Server Error`: erro interno inesperado.

Ordens de serviço em estados encerrados não podem receber determinadas alterações, respeitando as regras de negócio implementadas.

## Testes automatizados

O projeto utiliza xUnit para testes automatizados das regras de negócio.

Para executar os testes:

```bash
dotnet test TudoInclusolution.slnx
```

## Integração contínua e publicação

O projeto utiliza GitHub Actions para automatizar as etapas de restauração, compilação e execução dos testes a cada atualização da branch principal.

A API é publicada no Render utilizando Docker, enquanto o frontend é publicado como um site estático.

## Contas de demonstração

As contas de demonstração devem ser utilizadas exclusivamente para avaliação do projeto.

- **Administrador:** conta de demonstração configurada no ambiente publicado.
- **Cliente 1:** conta fictícia de demonstração.
- **Cliente 2:** conta fictícia de demonstração.

As credenciais de avaliação devem ser fornecidas separadamente ao avaliador, sem publicar senhas pessoais ou segredos no repositório.

## Uso de inteligência artificial

A inteligência artificial foi utilizada como ferramenta de apoio durante o desenvolvimento, principalmente para esclarecimento de conceitos, identificação de erros, revisão de código e orientação na implementação de funcionalidades.

### Exemplos de utilização

1. Orientação sobre autenticação e autorização utilizando JWT.
2. Apoio na implementação e organização de operações CRUD.
3. Auxílio na identificação e correção de erros no frontend e backend.

### Erro identificado durante o uso

Durante o desenvolvimento do frontend, foi identificado um problema no arquivo `TudoIncluso.Web/src/pages/Servicos.jsx`: o botão de edição estava posicionado fora do `map` responsável por renderizar os serviços, impedindo sua associação correta a cada item.

A estrutura foi corrigida, colocando o botão dentro da renderização de cada serviço.

### Aprendizado

O uso da inteligência artificial contribuiu para acelerar a resolução de dúvidas e facilitar o aprendizado de tecnologias utilizadas no projeto. Entretanto, foi necessário analisar, testar e compreender as sugestões recebidas, pois nem todas as respostas estavam corretas ou adequadas à estrutura existente.

A ferramenta foi utilizada como apoio, e não como substituta da compreensão técnica e da validação do código.
