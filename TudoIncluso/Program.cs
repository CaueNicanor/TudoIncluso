
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;
using TudoIncluso.Data;
using TudoIncluso.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Chave JWT não configurada.");

var chave = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(chave),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddProblemDetails();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Informe seu token JWT."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://tudoincluso.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
var app = builder.Build();
app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    var nome = app.Configuration["AdminInicial:Nome"];
    var email = app.Configuration["AdminInicial:Email"];
    var senha = app.Configuration["AdminInicial:Senha"];

    if (string.IsNullOrWhiteSpace(nome) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(senha))
    {
        throw new InvalidOperationException(
            "Configure os dados do administrador inicial."
        );
    }

    var adminExistente = await context.Usuarios
        .FirstOrDefaultAsync(u => u.Email == email);

    if (adminExistente == null)
    {
        var senhaHash = BCrypt.Net.BCrypt.HashPassword(senha);

        var admin = new Usuario(
            nome,
            email,
            senhaHash,
            "Admin"
        );

        context.Usuarios.Add(admin);

        await context.SaveChangesAsync();
    }
    else if (adminExistente.Perfil != "Admin")
    {
        throw new InvalidOperationException(
            "O e-mail configurado para o administrador já pertence a um usuário comum."
        );
    }
}



app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.MapGet("/api/versao", () =>
{
    return Results.Ok(new
    {
        nome = "TudoIncluso API",
        versao = "1.0.0"
    });
});

app.Run();
