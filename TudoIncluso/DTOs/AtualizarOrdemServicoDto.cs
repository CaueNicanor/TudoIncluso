
using System.ComponentModel.DataAnnotations;

namespace TudoIncluso.DTOs;

public class AtualizarOrdemServicoDto
{
    [Required(ErrorMessage = "O modelo do celular é obrigatório.")]
    [MaxLength(100)]
    public string ModeloCelular { get; set; } = string.Empty;

    [Required(ErrorMessage = "O defeito relatado é obrigatório.")]
    [MaxLength(500)]
    public string DefeitoRelatado { get; set; } = string.Empty;

    [Range(0, 99999999.99)]
    public decimal Orcamento { get; set; }
}
