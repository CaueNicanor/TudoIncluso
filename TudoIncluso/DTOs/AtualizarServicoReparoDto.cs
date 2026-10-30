
using System.ComponentModel.DataAnnotations;

namespace TudoIncluso.DTOs;

public class AtualizarServicoReparoDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0, 99999999.99,
        ErrorMessage = "O valor não pode ser negativo.")]
    public decimal Valor { get; set; }
}
