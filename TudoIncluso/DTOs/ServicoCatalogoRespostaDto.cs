
namespace TudoIncluso.DTOs;

public class ServicoCatalogoRespostaDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal PrecoBase { get; set; }
}
