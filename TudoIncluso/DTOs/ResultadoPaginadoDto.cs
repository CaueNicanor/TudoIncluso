namespace TudoIncluso.DTOs;

public class ResultadoPaginadoDto<T>
{
    public IEnumerable<T> Dados { get; set; } = [];
    public int Pagina { get; set; }
    public int TamanhoPagina { get; set; }
    public int TotalRegistros { get; set; }
    public int TotalPaginas { get; set; }
}