
namespace TudoIncluso.Models;

public class OrdemServico
{
    public int Id { get; private set; }

    public string ModeloCelular { get; private set; }

    public string DefeitoRelatado { get; private set; }

    public string Status { get; private set; }

    public decimal Orcamento { get; private set; }

    public DateTime DataEntrada { get; private set; }

    public List<ServicoReparo> Servicos { get; private set; } = new();

    // O EF Core utiliza este construtor para materializar a entidade.
    protected OrdemServico()
    {
        ModeloCelular = string.Empty;
        DefeitoRelatado = string.Empty;
        Status = string.Empty;
    }

    public OrdemServico(
        string modeloCelular,
        string defeitoRelatado,
        decimal orcamento)
    {
        if (string.IsNullOrWhiteSpace(modeloCelular))
            throw new ArgumentException(
                "O modelo do celular é obrigatório.");

        if (string.IsNullOrWhiteSpace(defeitoRelatado))
            throw new ArgumentException(
                "O defeito relatado é obrigatório.");

        if (orcamento < 0)
            throw new ArgumentException(
                "O orçamento não pode ser negativo.");

        ModeloCelular = modeloCelular;
        DefeitoRelatado = defeitoRelatado;
        Orcamento = orcamento;
        Status = "Aberta";
        DataEntrada = DateTime.UtcNow;
    }

    public void AtualizarStatus(string novoStatus)
    {
        var statusPermitidos = new[]
        {
        "Aberta",
        "Em andamento",
        "Concluida",
        "Cancelada"
    };

        if (!statusPermitidos.Contains(novoStatus))
            throw new ArgumentException("Status inválido.");

        if (Status == "Concluida" || Status == "Cancelada")
            throw new InvalidOperationException(
                "Não é possível alterar uma ordem encerrada."
            );

        Status = novoStatus;
    }

    public void AdicionarServico(ServicoReparo servico)
    {
        if (Status == "Concluida" || Status == "Cancelada")
            throw new InvalidOperationException(
                "Não é possível adicionar serviços a uma ordem encerrada.");

        ArgumentNullException.ThrowIfNull(servico);

        Servicos.Add(servico);
    }



public void AtualizarDados(
    string modeloCelular,
    string defeitoRelatado,
    decimal orcamento)
    {
        if (string.IsNullOrWhiteSpace(modeloCelular))
            throw new ArgumentException("O modelo do celular é obrigatório.");

        if (string.IsNullOrWhiteSpace(defeitoRelatado))
            throw new ArgumentException("O defeito relatado é obrigatório.");

        if (orcamento < 0)
            throw new ArgumentException("O orçamento não pode ser negativo.");

        ModeloCelular = modeloCelular;
        DefeitoRelatado = defeitoRelatado;
        Orcamento = orcamento;
    }

    public int? UsuarioId { get; private set; }
    public Usuario? Usuario { get; private set; }


    public void DefinirProprietario(int usuarioId)
    {
        if (usuarioId <= 0)
            throw new ArgumentException("Usuário inválido.");

        if (UsuarioId.HasValue)
            throw new InvalidOperationException(
                "Esta ordem já possui um proprietário."
            );

        UsuarioId = usuarioId;
    }

}
