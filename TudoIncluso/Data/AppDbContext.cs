
using Microsoft.EntityFrameworkCore;
using TudoIncluso.Models;


namespace TudoIncluso.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<OrdemServico> OrdensServico => Set<OrdemServico>();

    public DbSet<ServicoReparo> ServicosReparo => Set<ServicoReparo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OrdemServico>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.ModeloCelular)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(o => o.DefeitoRelatado)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(o => o.Status)
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(o => o.Orcamento)
                .HasPrecision(10, 2);

            entity.HasMany(o => o.Servicos)
                .WithOne(s => s.OrdemServico)
                .HasForeignKey(s => s.OrdemServicoId)
                .IsRequired();

            entity.HasOne(o => o.Usuario)
    .WithMany(u => u.OrdensServico)
    .HasForeignKey(o => o.UsuarioId)
    .IsRequired(false);

            modelBuilder.Entity<Usuario>(entity =>
{
    entity.HasKey(u => u.Id);

    entity.Property(u => u.Nome)
        .HasMaxLength(100)
        .IsRequired();

    entity.Property(u => u.Email)
        .HasMaxLength(150)
        .IsRequired();

    entity.HasIndex(u => u.Email)
        .IsUnique();

    entity.Property(u => u.SenhaHash)
        .IsRequired();

    entity.Property(u => u.Perfil)
        .HasMaxLength(20)
        .IsRequired();

    entity.HasMany(u => u.OrdensServico)
        .WithOne(o => o.Usuario)
        .HasForeignKey(o => o.UsuarioId)
        .IsRequired(false);
});
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Nome)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(u => u.Email)
                    .HasMaxLength(150)
                    .IsRequired();

                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.Property(u => u.SenhaHash)
                    .IsRequired();

                entity.Property(u => u.Perfil)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.HasMany(u => u.OrdensServico)
                    .WithOne(o => o.Usuario)
                    .HasForeignKey(o => o.UsuarioId)
                    .IsRequired(false);
            });

            modelBuilder.Entity<ServicoCatalogo>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Nome)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(s => s.Descricao)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(s => s.PrecoBase)
                    .HasPrecision(10, 2)
                    .IsRequired();
            });
        });

        modelBuilder.Entity<ServicoReparo>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.Descricao)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(s => s.Valor)
                .HasPrecision(10, 2);
        });


        modelBuilder.Entity<ServicoCatalogo>().HasData(
            new
            {
                Id = 2,
                Nome = "Troca de tela",
                Descricao = "Substituição de tela danificada.",
                PrecoBase = 250.00m
            },
            new
            {
                Id = 3,
                Nome = "Troca de conector de carga",
                Descricao = "Reparo ou substituição do conector de carregamento.",
                PrecoBase = 120.00m
            },
            new
            {
                Id = 4,
                Nome = "Reparo de câmera",
                Descricao = "Diagnóstico e reparo do sistema de câmera.",
                PrecoBase = 150.00m
            },
            new
            {
                Id = 5,
                Nome = "Reparo de alto-falante",
                Descricao = "Reparo do alto-falante de áudio.",
                PrecoBase = 100.00m
            },
            new
            {
                Id = 6,
                Nome = "Reparo de microfone",
                Descricao = "Diagnóstico e reparo do microfone.",
                PrecoBase = 90.00m
            },
            new
            {
                Id = 7,
                Nome = "Diagnóstico técnico",
                Descricao = "Avaliação técnica para identificação de defeitos.",
                PrecoBase = 50.00m
            },
            new
            {
                Id = 8,
                Nome = "Recuperação de software",
                Descricao = "Diagnóstico e recuperação de problemas de software.",
                PrecoBase = 110.00m
            }
        );

    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();

    public DbSet<ServicoCatalogo> ServicosCatalogo { get; set; }
}
