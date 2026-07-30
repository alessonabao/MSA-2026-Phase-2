using backend.Models;

namespace backend.Tests.Testing;

/// <summary>
/// Builds ready-to-use <see cref="User"/> instances for Profile handler tests, so each test only
/// has to override the one or two fields it actually cares about.
/// </summary>
public static class TestUserFactory
{
    /// <summary>Creates a <see cref="User"/> with a random id and only the fields passed in populated - everything else stays unset (null), matching a real just-registered account.</summary>
    public static User Create(
        string? id = null,
        string profileName = "Test User",
        string? profileBio = null,
        string? profileImageUrl = null,
        string? weapon = null,
        string? skillLevel = null,
        string? contactInfo = null)
    {
        return new User
        {
            Id = id ?? Guid.NewGuid().ToString(),
            UserName = "test@example.com",
            Email = "test@example.com",
            ProfileName = profileName,
            ProfileBio = profileBio,
            ProfileImageUrl = profileImageUrl,
            Weapon = weapon,
            SkillLevel = skillLevel,
            ContactInfo = contactInfo
        };
    }
}
