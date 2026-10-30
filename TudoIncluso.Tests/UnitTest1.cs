
using TudoIncluso.Models;

namespace TudoIncluso.Tests;

public class ServicoCatalogoTests
{
    [Fact]
    public void CriarServico_ComDadosValidos_DeveCriarServico()
    {
        // Arrange
        var nome = "Troca de tela";
        var descricao = "Substituição de tela danificada.";
        var preco = 250m;

        // Act
        var servico = new ServicoCatalogo(nome, descricao, preco);

        // Assert
        Assert.Equal(nome, servico.Nome);
        Assert.Equal(descricao, servico.Descricao);
        Assert.Equal(preco, servico.PrecoBase);
    }

    [Fact]
    public void CriarServico_SemNome_DeveLancarExcecao()
    {
        Assert.Throws<ArgumentException>(() =>
            new ServicoCatalogo("", "Descrição válida", 100m));
    }

    [Fact]
    public void CriarServico_SemDescricao_DeveLancarExcecao()
    {
        Assert.Throws<ArgumentException>(() =>
            new ServicoCatalogo("Troca de tela", "", 100m));
    }

    [Fact]
    public void CriarServico_ComPrecoNegativo_DeveLancarExcecao()
    {
        Assert.Throws<ArgumentException>(() =>
            new ServicoCatalogo("Troca de tela", "Descrição válida", -10m));
    }

    [Fact]
    public void AtualizarDados_ComDadosValidos_DeveAtualizarServico()
    {
        // Arrange
        var servico = new ServicoCatalogo(
            "Troca de tela", "Tela antiga", 250m);

        // Act
        servico.AtualizarDados(
            "Troca de bateria", "Substituição da bateria", 180m);

        // Assert
        Assert.Equal("Troca de bateria", servico.Nome);
        Assert.Equal("Substituição da bateria", servico.Descricao);
        Assert.Equal(180m, servico.PrecoBase);
    }
}
