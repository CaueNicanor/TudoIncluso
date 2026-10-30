
using System.ComponentModel.DataAnnotations;

namespace TudoIncluso.DTOs;

public class CriarServicoCatalogoDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0, 99999999.99, ErrorMessage = "O preço deve ser igual ou maior que zero.")]
    public decimal PrecoBase { get; set; }
}
