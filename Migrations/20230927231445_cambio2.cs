using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TPractico.Migrations
{
    public partial class cambio2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfesorID",
                table: "Tareas");

            migrationBuilder.AddColumn<string>(
                name: "ProfesorNombre",
                table: "Tareas",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfesorNombre",
                table: "Tareas");

            migrationBuilder.AddColumn<int>(
                name: "ProfesorID",
                table: "Tareas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
