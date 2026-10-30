
using TudoIncluso.Models;

namespace TudoIncluso.Tests;

public class OrdemServicoTests
{
    [Fact]
    public void CriarOrdemServico_ComDadosValidos_DeveIniciarComoAberta()
    {
        var ordem = new OrdemServico(
            "Samsung Galaxy A54",
            "Tela quebrada",
            250m
        );

        Assert.Equal("Aberta", ordem.Status);
    }

    [Fact]
    public void AtualizarStatus_ComStatusValido_DeveAtualizar()
    {
        var ordem = new OrdemServico(
            "Samsung Galaxy A54",
            "Tela quebrada",
            250m
        );

        ordem.AtualizarStatus("Em andamento");

        Assert.Equal("Em andamento", ordem.Status);
    }

    [Fact]
    public void AtualizarStatus_ComStatusInvalido_DeveLancarExcecao()
    {
        var ordem = new OrdemServico(
            "Samsung Galaxy A54",
            "Tela quebrada",
            250m
        );

        Assert.Throws<ArgumentException>(() =>
            ordem.AtualizarStatus("Aguardando peças"));
    }

    [Fact]
    public void AtualizarStatus_AposConclusao_DeveImpedirAlteracao()
    {
        var ordem = new OrdemServico(
            "Samsung Galaxy A54",
            "Tela quebrada",
            250m
        );

        ordem.AtualizarStatus("Concluida");

        Assert.Throws<InvalidOperationException>(() =>
            ordem.AtualizarStatus("Aberta"));
    }

    [Fact]
    public void DefinirProprietario_ComIdValido_DeveDefinirProprietario()
    {
        var ordem = new OrdemServico(
            "Samsung Galaxy A54",
            "Tela quebrada",
            250m
        );

        ordem.DefinirProprietario(1);

        Assert.Equal(1, ordem.UsuarioId);
    }
}
