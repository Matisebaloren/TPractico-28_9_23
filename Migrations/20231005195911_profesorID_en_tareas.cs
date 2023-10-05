using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TPractico.Migrations
{
    public partial class profesorID_en_tareas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
