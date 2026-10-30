using System.ComponentModel.DataAnnotations;

namespace TudoIncluso.DTOs;

public class AtualizarStatusOrdemServicoDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}