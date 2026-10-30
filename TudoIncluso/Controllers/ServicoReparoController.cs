
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TudoIncluso.Data;
using TudoIncluso.DTOs;
using TudoIncluso.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TudoIncluso.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServicoReparoController : ControllerBase
{
    private readonly AppDbContext _context;

    public ServicoReparoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("ordem/{ordemServicoId:int}")]
    public async Task<ActionResult<ServicoReparoRespostaDto>> Criar(
        int ordemServicoId,
        CriarServicoReparoDto dto)
    {
        var ordem = await _context.OrdensServico
            .FirstOrDefaultAsync(o => o.Id == ordemServicoId);

        if (ordem == null)
            return NotFound(new
            {
                mensagem = "Ordem de serviço não encontrada."
            });

        if (!PodeAcessarOrdem(ordem))
            return NotFound();

        var servico = new ServicoReparo(
            dto.Descricao,
            dto.Valor
        );

        ordem.AdicionarServico(servico);

        await _context.SaveChangesAsync();

        var resposta = new ServicoReparoRespostaDto
        {
            Id = servico.Id,
            Descricao = servico.Descricao,
            Valor = servico.Valor,
            OrdemServicoId = ordemServicoId
        };

        return CreatedAtAction(
            nameof(ListarPorOrdem),
            new { ordemServicoId },
            resposta
        );
    }

    [HttpGet("ordem/{ordemServicoId}")]
    public async Task<ActionResult<IEnumerable<ServicoReparoRespostaDto>>>
     ListarPorOrdem(int ordemServicoId)
    {
        var ordem = await _context.OrdensServico
            .FirstOrDefaultAsync(o => o.Id == ordemServicoId);

        if (ordem == null)
            return NotFound();

        if (!PodeAcessarOrdem(ordem))
            return NotFound();

        var servicos = await _context.ServicosReparo
            .AsNoTracking()
            .Where(s => s.OrdemServicoId == ordemServicoId)
            .Select(s => new ServicoReparoRespostaDto
            {
                Id = s.Id,
                Descricao = s.Descricao,
                Valor = s.Valor,
                OrdemServicoId = s.OrdemServicoId
            })
            .ToListAsync();

        return Ok(servicos);
    }


    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServicoReparoRespostaDto>> BuscarPorId(int id)
    {
        var servico = await _context.ServicosReparo
            .AsNoTracking()
            .Include(s => s.OrdemServico)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (servico == null)
            return NotFound();

        if (!PodeAcessarOrdem(servico.OrdemServico))
            return NotFound();

        var resposta = new ServicoReparoRespostaDto
        {
            Id = servico.Id,
            Descricao = servico.Descricao,
            Valor = servico.Valor,
            OrdemServicoId = servico.OrdemServicoId
        };

        return Ok(resposta);
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(
        int id,
        AtualizarServicoReparoDto dto)
    {
        var servico = await _context.ServicosReparo
            .Include(s => s.OrdemServico)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (servico == null)
            return NotFound(new
            {
                mensagem = "Serviço de reparo não encontrado."
            });

        if (!PodeAcessarOrdem(servico.OrdemServico))
            return NotFound();

        if (servico.OrdemServico.Status == "Concluida" ||
            servico.OrdemServico.Status == "Cancelada")
            return Conflict(new
            {
                mensagem = "Não é possível alterar serviços de uma ordem encerrada."
            });

        servico.AtualizarDados(dto.Descricao, dto.Valor);

        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var servico = await _context.ServicosReparo
            .Include(s => s.OrdemServico)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (servico == null)
            return NotFound(new
            {
                mensagem = "Serviço de reparo não encontrado."
            });

        if (!PodeAcessarOrdem(servico.OrdemServico))
            return NotFound();

        if (servico.OrdemServico.Status == "Concluida" ||
            servico.OrdemServico.Status == "Cancelada")
            return Conflict(new
            {
                mensagem = "Não é possível excluir serviços de uma ordem encerrada."
            });

        _context.ServicosReparo.Remove(servico);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PodeAcessarOrdem(OrdemServico ordem)
    {
        if (User.IsInRole("Admin"))
            return true;

        var usuarioId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        return ordem.UsuarioId == usuarioId;
    }

}
