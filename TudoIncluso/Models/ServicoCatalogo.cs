namespace TudoIncluso.Models;

public class ServicoCatalogo
{
    public int Id { get; private set; }
    public string Nome { get; private set; }
    public string Descricao { get; private set; }
    public decimal PrecoBase { get; private set; }

    protected ServicoCatalogo()
    {
        Nome = string.Empty;
        Descricao = string.Empty;
    }

    public ServicoCatalogo(
        string nome,
        string descricao,
        decimal precoBase)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome obrigatório.");

        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException("Descrição obrigatória.");

        if (precoBase < 0)
            throw new ArgumentException("Preço inválido.");

        Nome = nome;
        Descricao = descricao;
        PrecoBase = precoBase;
    }
    public void AtualizarDados(string nome, string descricao, decimal precoBase)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome obrigatório.");

        if (string.IsNullOrWhiteSpace(descricao))
            throw new ArgumentException("Descrição obrigatória.");

        if (precoBase < 0)
            throw new ArgumentException("Preço inválido.");

        Nome = nome;
        Descricao = descricao;
        PrecoBase = precoBase;
    }
}