using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TPractico.Migrations
{
    public partial class Migracion2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Fecha",
                table: "Carreras");

            migrationBuilder.AddColumn<int>(
                name: "Duracion",
                table: "Carreras",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duracion",
                table: "Carreras");

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha",
                table: "Carreras",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
