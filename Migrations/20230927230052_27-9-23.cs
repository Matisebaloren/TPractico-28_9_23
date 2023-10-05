using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TPractico.Migrations
{
    public partial class _27923 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "email",
                table: "Profesores",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "direccion",
                table: "Profesores",
                newName: "Direccion");

            migrationBuilder.AddColumn<int>(
                name: "DNI",
                table: "Alumnos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Alumnos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Alumnos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Asignaturas",
                columns: table => new
                {
                    AsignaturaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CarreraID = table.Column<int>(type: "int", nullable: false),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asignaturas", x => x.AsignaturaID);
                });

            migrationBuilder.CreateTable(
                name: "ProfesorAsignaturas",
                columns: table => new
                {
                    ProfesorAsignaturaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfesorID = table.Column<int>(type: "int", nullable: false),
                    AsignaturaID = table.Column<int>(type: "int", nullable: false),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfesorAsignaturas", x => x.ProfesorAsignaturaID);
                });

            migrationBuilder.CreateTable(
                name: "Tareas",
                columns: table => new
                {
                    TareaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaCarga = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AsignaturaID = table.Column<int>(type: "int", nullable: false),
                    Eliminada = table.Column<bool>(type: "bit", nullable: false),
                    ProfesorID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tareas", x => x.TareaID);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Asignaturas");

            migrationBuilder.DropTable(
                name: "ProfesorAsignaturas");

            migrationBuilder.DropTable(
                name: "Tareas");

            migrationBuilder.DropColumn(
                name: "DNI",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Alumnos");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Alumnos");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Profesores",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Direccion",
                table: "Profesores",
                newName: "direccion");
        }
    }
}
