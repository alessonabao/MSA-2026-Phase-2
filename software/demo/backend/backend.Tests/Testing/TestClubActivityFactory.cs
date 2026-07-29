using backend.Models;

namespace backend.Tests.Testing;

/// <summary>
/// Builds ready-to-use <see cref="ClubActivity"/> instances for tests, so each test only has
/// to override the one or two fields (usually <c>Id</c> or <c>Title</c>) it actually cares about.
/// </summary>
public static class TestClubActivityFactory
{
    /// <summary>
    /// Creates a fully populated <see cref="ClubActivity"/> with sensible defaults for every
    /// required field. Pass <paramref name="id"/> or <paramref name="title"/> to control the
    /// values a specific test needs to assert on or match against an existing row.
    /// </summary>
    /// <param name="id">The activity's id. Defaults to a new random GUID when omitted.</param>
    /// <param name="title">The activity's title. Defaults to a sample bootcamp event.</param>
    public static ClubActivity Create(string? id = null, string title = "Sabre Beginner Bootcamp")
    {
        return new ClubActivity
        {
            Id = id ?? Guid.NewGuid().ToString(),
            Title = title,
            Date = new DateTime(2026, 8, 6),
            StartTime = new TimeOnly(18, 0),
            EndTime = new TimeOnly(20, 0),
            Description = "Test activity description.",
            Weapon = "Sabre",
            SkillLevel = "Beginner",
            Type = "Training",
            IsCancelled = false,
            City = "Auckland",
            Venue = "Hiwa Recreation Centre",
            Latitude = -36.852634,
            Longitude = 174.769104,
            Price = 0.00
        };
    }
}
