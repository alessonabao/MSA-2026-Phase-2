using System.Diagnostics.CodeAnalysis;
using backend.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Testing;

/// <summary>
/// Builds a real <see cref="AppDbContext"/> backed by an isolated, in-memory SQLite database,
/// so each test gets a private, disposable database instead of touching the app's real
/// <c>fencingclub.db</c> file.
/// </summary>
public static class TestDbContextFactory
{
    /// <summary>
    /// Creates an <see cref="AppDbContext"/> backed by a fresh in-memory SQLite database with
    /// its schema already applied. Dispose the returned context when the test is done to close
    /// the underlying connection.
    /// </summary>
    /// <remarks>
    /// Uses a real SQLite connection rather than the EF Core InMemory provider: backend.csproj's
    /// InMemory package is pinned to 9.0.0 while the rest of the EF Core graph is on 10.0.x, and
    /// that gap breaks at runtime. SQLite is already an in-family, normally-flowing dependency of
    /// backend.csproj, so it doesn't hit that mismatch.
    /// </remarks>
    public static AppDbContext Create()
    {
        var connection = new SqliteConnection("Filename=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new TestAppDbContext(options, connection);
        context.Database.EnsureCreated();

        return context;
    }

    /// <summary>
    /// A test-only <see cref="AppDbContext"/> subclass that exists for two reasons: it satisfies
    /// the compiler's required-member check on <see cref="AppDbContext.ClubActivities"/> (which
    /// EF Core actually populates via reflection after construction, not through an object
    /// initializer), and it closes the SQLite connection - which EF does not own/dispose
    /// automatically since it was opened externally - when the context is disposed.
    /// </summary>
    private sealed class TestAppDbContext : AppDbContext
    {
        private readonly SqliteConnection _connection;

        [SetsRequiredMembers]
#pragma warning disable CS8618 // ClubActivities is populated by EF Core's own reflection-based init, not this constructor.
        public TestAppDbContext(DbContextOptions options, SqliteConnection connection) : base(options)
#pragma warning restore CS8618
        {
            _connection = connection;
        }

        /// <summary>Disposes the underlying EF Core context, then closes the SQLite connection it was given.</summary>
        public override void Dispose()
        {
            base.Dispose();
            _connection.Dispose();
        }
    }
}
