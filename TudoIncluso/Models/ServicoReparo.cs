
namespace TudoIncluso.Models;

public class ServicoReparo
{
    public int Id { get; private set; }

    public string Descricao { get; private set; }

    public decimal Valor { get; private set; }

    public int OrdemServicoId { get; private set; }

    public OrdemServico OrdemServico { get; private set; } = null!;

    protected ServicoReparo()
    {
        Descricao = string.Empty;
    }

    public ServicoReparo(string descricao, decimal valor)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException(
                "A descrição do serviço é obrigatória.");

        if (valor < 0)
            throw new ArgumentException(
                "O valor do serviço não pode ser negativo.");

        Descricao = descricao;
        Valor = valor;
    }


    public void AtualizarDados(string descricao, decimal valor)
    {
        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException(
                "A descrição do serviço é obrigatória.");

        if (valor < 0)
            throw new ArgumentException(
                "O valor do serviço não pode ser negativo.");

        Descricao = descricao;
        Valor = valor;
    }

}
