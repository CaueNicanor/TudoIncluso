
using System.ComponentModel.DataAnnotations;

namespace TudoIncluso.DTOs;

public class AtualizarServicoCatalogoDto
{
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0, 99999999.99)]
    public decimal PrecoBase { get; set; }
}
