
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TudoIncluso.Data;
using TudoIncluso.DTOs;
using TudoIncluso.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace TudoIncluso.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuarioController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("registrar")]
    public async Task<ActionResult<UsuarioRespostaDto>> Registrar(
        CriarUsuarioDto dto)
    {
        var emailExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExiste)
        {
            return Conflict(new
            {
                mensagem = "Este e-mail já está cadastrado."
            });
        }

        var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        var usuario = new Usuario(
            dto.Nome,
            dto.Email,
            senhaHash,
            "Cliente"
        );

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var resposta = new UsuarioRespostaDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Perfil = usuario.Perfil
        };

        return Ok(resposta);
    }


    [HttpPost("login")]
    public async Task<ActionResult<LoginRespostaDto>> Login(LoginDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null)
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        var senhaCorreta = BCrypt.Net.BCrypt.Verify(
            dto.Senha,
            usuario.SenhaHash
        );

        if (!senhaCorreta)
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        var jwtKey = HttpContext.RequestServices
            .GetRequiredService<IConfiguration>()["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException("Chave JWT não configurada.");

        var chave = Encoding.UTF8.GetBytes(jwtKey);

        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Name, usuario.Nome),
        new Claim(ClaimTypes.Email, usuario.Email),
        new Claim(ClaimTypes.Role, usuario.Perfil)
    };

        var credenciais = new SigningCredentials(
            new SymmetricSecurityKey(chave),
            SecurityAlgorithms.HmacSha256
        );

        var expiracao = DateTime.UtcNow.AddHours(1);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expiracao,
            signingCredentials: credenciais
        );

        var tokenGerado = new JwtSecurityTokenHandler()
            .WriteToken(token);

        var resposta = new LoginRespostaDto
        {
            Token = tokenGerado,
            Expiracao = expiracao,
            Usuario = new UsuarioRespostaDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Perfil = usuario.Perfil
            }
        };

        return Ok(resposta);
    }


    [Authorize]
    [HttpGet("me")]
    public ActionResult<UsuarioRespostaDto> MeuPerfil()
    {
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var nome = User.FindFirst(ClaimTypes.Name)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var perfil = User.FindFirst(ClaimTypes.Role)?.Value;

        if (id == null)
            return Unauthorized();

        var resposta = new UsuarioRespostaDto
        {
            Id = int.Parse(id),
            Nome = nome ?? string.Empty,
            Email = email ?? string.Empty,
            Perfil = perfil ?? string.Empty
        };

        return Ok(resposta);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> ListarClientes()
    {
        var clientes = await _context.Usuarios
            .Where(u => u.Perfil == "Cliente")
            .Select(u => new
            {
                u.Id,
                u.Nome,
                u.Email,
                Ordens = u.OrdensServico.Count()
            })
            .ToListAsync();

        return Ok(clientes);
    }


}
