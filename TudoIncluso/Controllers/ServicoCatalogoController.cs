
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TudoIncluso.Data;
using TudoIncluso.DTOs;
using TudoIncluso.Models;

namespace TudoIncluso.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicoCatalogoController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ServicoCatalogoController> _logger;

    public ServicoCatalogoController(
     AppDbContext context,
     ILogger<ServicoCatalogoController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ResultadoPaginadoDto<ServicoCatalogoRespostaDto>>> Listar(
        int pagina = 1,
        int tamanhoPagina = 10,
        string? busca = null)
    {
        if (pagina < 1 || tamanhoPagina < 1 || tamanhoPagina > 100)
        {
            return Problem(
    detail: "A página deve ser maior que zero e o tamanho deve estar entre 1 e 100.",
    statusCode: StatusCodes.Status400BadRequest,
    title: "Parâmetros de paginação inválidos."
);
        }

        var query = _context.ServicosCatalogo.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            query = query.Where(s => s.Nome.Contains(busca));
        }

        var totalRegistros = await query.CountAsync();

        var servicos = await query
            .OrderBy(s => s.Nome)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .Select(s => new ServicoCatalogoRespostaDto
            {
                Id = s.Id,
                Nome = s.Nome,
                Descricao = s.Descricao,
                PrecoBase = s.PrecoBase
            })
            .ToListAsync();

        var resultado = new ResultadoPaginadoDto<ServicoCatalogoRespostaDto>
        {
            Dados = servicos,
            Pagina = pagina,
            TamanhoPagina = tamanhoPagina,
            TotalRegistros = totalRegistros,
            TotalPaginas = (int)Math.Ceiling(
                totalRegistros / (double)tamanhoPagina)
        };

        return Ok(resultado);
    }





    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServicoCatalogoRespostaDto>> BuscarPorId(int id)
    {
        var servico = await _context.ServicosCatalogo
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new ServicoCatalogoRespostaDto
            {
                Id = s.Id,
                Nome = s.Nome,
                Descricao = s.Descricao,
                PrecoBase = s.PrecoBase
            })
            .FirstOrDefaultAsync();

        if (servico == null)
        {
            return Problem(
    detail: "O serviço solicitado não foi encontrado no catálogo.",
    statusCode: StatusCodes.Status404NotFound,
    title: "Serviço não encontrado."
);
        }

        return Ok(servico);
    }



    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ServicoCatalogoRespostaDto>> Criar(
        CriarServicoCatalogoDto dto)
    {
        var servico = new ServicoCatalogo(
            dto.Nome,
            dto.Descricao,
            dto.PrecoBase
        );

        _context.ServicosCatalogo.Add(servico);
        await _context.SaveChangesAsync();
        _logger.LogInformation(
    "Serviço de catálogo criado. ID: {ServicoId}",
    servico.Id
);

        var resposta = new ServicoCatalogoRespostaDto
        {
            Id = servico.Id,
            Nome = servico.Nome,
            Descricao = servico.Descricao,
            PrecoBase = servico.PrecoBase
        };

        return CreatedAtAction(
            nameof(BuscarPorId),
            new { id = servico.Id },
            resposta
        );
    }


    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Atualizar(
        int id,
        AtualizarServicoCatalogoDto dto)
    {
        var servico = await _context.ServicosCatalogo
            .FirstOrDefaultAsync(s => s.Id == id);

        if (servico == null)
        {
            return Problem(
     detail: "O serviço solicitado não foi encontrado no catálogo.",
     statusCode: StatusCodes.Status404NotFound,
     title: "Serviço não encontrado."
 );
        }

        servico.AtualizarDados(
            dto.Nome,
            dto.Descricao,
            dto.PrecoBase
        );

        await _context.SaveChangesAsync();
        _logger.LogInformation(
    "Serviço de catálogo atualizado. ID: {ServicoId}",
    servico.Id
);

        return NoContent();
    }


    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Excluir(int id)
    {
        var servico = await _context.ServicosCatalogo
            .FirstOrDefaultAsync(s => s.Id == id);

        if (servico == null)
        {
            return Problem(
    detail: "O serviço solicitado não foi encontrado no catálogo.",
    statusCode: StatusCodes.Status404NotFound,
    title: "Serviço não encontrado."
);
        }

        _context.ServicosCatalogo.Remove(servico);
        await _context.SaveChangesAsync();
        _logger.LogInformation(
    "Serviço de catálogo excluído. ID: {ServicoId}",
    servico.Id
);

        return NoContent();
    }


}
