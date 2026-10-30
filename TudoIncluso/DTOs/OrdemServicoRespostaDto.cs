
namespace TudoIncluso.DTOs;

public class OrdemServicoRespostaDto
{
    public int Id { get; set; }

    public string ModeloCelular { get; set; } = string.Empty;

    public string DefeitoRelatado { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public decimal Orcamento { get; set; }

    public DateTime DataEntrada { get; set; }
}
