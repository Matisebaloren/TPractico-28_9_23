using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TPractico.Migrations
{
    public partial class Eliminado : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Carreras",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Alumnos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Carreras");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Alumnos");
        }
    }
}
