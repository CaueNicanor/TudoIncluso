using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TudoIncluso.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarServicosIniciais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ServicosCatalogo",
                columns: new[] { "Id", "Descricao", "Nome", "PrecoBase" },
                values: new object[,]
                {
                    { 2, "Substituição de tela danificada.", "Troca de tela", 250.00m },
                    { 3, "Reparo ou substituição do conector de carregamento.", "Troca de conector de carga", 120.00m },
                    { 4, "Diagnóstico e reparo do sistema de câmera.", "Reparo de câmera", 150.00m },
                    { 5, "Reparo do alto-falante de áudio.", "Reparo de alto-falante", 100.00m },
                    { 6, "Diagnóstico e reparo do microfone.", "Reparo de microfone", 90.00m },
                    { 7, "Avaliação técnica para identificação de defeitos.", "Diagnóstico técnico", 50.00m },
                    { 8, "Diagnóstico e recuperação de problemas de software.", "Recuperação de software", 110.00m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ServicosCatalogo",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
