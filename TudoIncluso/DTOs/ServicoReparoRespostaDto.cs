
namespace TudoIncluso.DTOs;

public class ServicoReparoRespostaDto
{
    public int Id { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public int OrdemServicoId { get; set; }
}
