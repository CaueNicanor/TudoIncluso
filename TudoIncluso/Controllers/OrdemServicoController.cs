
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TudoIncluso.Data;
using TudoIncluso.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TudoIncluso.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdemServicoController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdemServicoController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<ResultadoPaginadoDto<OrdemServicoRespostaDto>>>
    Listar(int pagina = 1, int tamanhoPagina = 10)
    {
        if (pagina < 1 || tamanhoPagina < 1 || tamanhoPagina > 100)
            return BadRequest("Parâmetros de paginação inválidos.");

        var query = _context.OrdensServico.AsNoTracking();

        if (!User.IsInRole("Admin"))
        {
            var usuarioId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            query = query.Where(o => o.UsuarioId == usuarioId);
        }

        var totalRegistros = await query.CountAsync();

        var ordens = await query
            .OrderByDescending(o => o.DataEntrada)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .Select(o => new OrdemServicoRespostaDto
            {
                Id = o.Id,
                ModeloCelular = o.ModeloCelular,
                DefeitoRelatado = o.DefeitoRelatado,
                Status = o.Status,
                Orcamento = o.Orcamento,
                DataEntrada = o.DataEntrada
            })
            .ToListAsync();

        var resultado = new ResultadoPaginadoDto<OrdemServicoRespostaDto>
        {
            Dados = ordens,
            Pagina = pagina,
            TamanhoPagina = tamanhoPagina,
            TotalRegistros = totalRegistros,
            TotalPaginas = (int)Math.Ceiling(
                totalRegistros / (double)tamanhoPagina
            )
        };

        return Ok(resultado);
    }





    [HttpPost]
    public async Task<ActionResult<OrdemServicoRespostaDto>> Criar(
        CriarOrdemServicoDto dto)
    {
        var ordem = new Models.OrdemServico(
            dto.ModeloCelular,
            dto.DefeitoRelatado,
            dto.Orcamento
        );

        var usuarioId = int.Parse(
    User.FindFirst(ClaimTypes.NameIdentifier)!.Value
);

        ordem.DefinirProprietario(usuarioId);

        _context.OrdensServico.Add(ordem);

        await _context.SaveChangesAsync();

        var resposta = new OrdemServicoRespostaDto
        {
            Id = ordem.Id,
            ModeloCelular = ordem.ModeloCelular,
            DefeitoRelatado = ordem.DefeitoRelatado,
            Status = ordem.Status,
            Orcamento = ordem.Orcamento,
            DataEntrada = ordem.DataEntrada
        };

        return CreatedAtAction(
            nameof(Listar),
            new { id = ordem.Id },
            resposta
        );
    }



    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrdemServicoRespostaDto>> BuscarPorId(int id)
    {
        var query = _context.OrdensServico.AsNoTracking();

        if (!User.IsInRole("Admin"))
        {
            var usuarioId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            query = query.Where(o => o.UsuarioId == usuarioId);
        }

        var ordem = await query
            .Where(o => o.Id == id)
            .Select(o => new OrdemServicoRespostaDto
            {
                Id = o.Id,
                ModeloCelular = o.ModeloCelular,
                DefeitoRelatado = o.DefeitoRelatado,
                Status = o.Status,
                Orcamento = o.Orcamento,
                DataEntrada = o.DataEntrada
            })
            .FirstOrDefaultAsync();

        if (ordem == null)
            return NotFound();

        return Ok(ordem);
    }



    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(
        int id,
        AtualizarOrdemServicoDto dto)
    {
        var ordem = await _context.OrdensServico
            .FirstOrDefaultAsync(o => o.Id == id);

        if (ordem == null)
            return NotFound(new
            {
                mensagem = "Ordem de serviço não encontrada."
            });

        if (!User.IsInRole("Admin"))
        {
            var usuarioId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            if (ordem.UsuarioId != usuarioId)
                return NotFound();
        }

        if (ordem.Status == "Concluida" || ordem.Status == "Cancelada")
            return Conflict(new
            {
                mensagem = "Não é possível atualizar uma ordem encerrada."
            });

        ordem.AtualizarDados(
            dto.ModeloCelular,
            dto.DefeitoRelatado,
            dto.Orcamento
        );

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var ordem = await _context.OrdensServico
            .FirstOrDefaultAsync(o => o.Id == id);

        if (ordem == null)
            return NotFound(new
            {
                mensagem = "Ordem de serviço não encontrada."
            });

        if (ordem.Status == "Concluida" || ordem.Status == "Cancelada")
            return Conflict(new
            {
                mensagem = "Não é possível excluir uma ordem encerrada."
            });

        _context.OrdensServico.Remove(ordem);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AtualizarStatus(
    int id,
    AtualizarStatusOrdemServicoDto dto)
    {
        var ordem = await _context.OrdensServico.FindAsync(id);

        if (ordem == null)
            return NotFound();

        try
        {
            ordem.AtualizarStatus(dto.Status);

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensagem = ex.Message });
        }
    }
}


