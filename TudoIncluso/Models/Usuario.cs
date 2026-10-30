
namespace TudoIncluso.Models;

public class Usuario
{
    public int Id { get; private set; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string SenhaHash { get; private set; }
    public string Perfil { get; private set; }

    public List<OrdemServico> OrdensServico { get; private set; } = new();

    protected Usuario()
    {
        Nome = string.Empty;
        Email = string.Empty;
        SenhaHash = string.Empty;
        Perfil = string.Empty;
    }

    public Usuario(string nome, string email, string senhaHash, string perfil)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome é obrigatório.");

        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("O e-mail é obrigatório.");

        if (string.IsNullOrWhiteSpace(senhaHash))
            throw new ArgumentException("A senha é obrigatória.");

        if (perfil != "Admin" && perfil != "Cliente")
            throw new ArgumentException("Perfil inválido.");

        Nome = nome;
        Email = email;
        SenhaHash = senhaHash;
        Perfil = perfil;
    }
}
