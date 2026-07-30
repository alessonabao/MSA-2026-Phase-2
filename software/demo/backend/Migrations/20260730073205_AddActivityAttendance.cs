using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddActivityAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActivityAttendances",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    IsCancelled = table.Column<bool>(type: "INTEGER", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CancelledAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityAttendances", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttendances_ActivityId_UserId",
                table: "ActivityAttendances",
                columns: new[] { "ActivityId", "UserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityAttendances");
        }
    }
}
