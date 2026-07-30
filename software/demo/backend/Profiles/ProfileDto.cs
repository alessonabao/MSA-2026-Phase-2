using System;

namespace backend.Profiles;

public class ProfileDto
{
          public required string Id { get; set; }
          public required string Email { get; set; }
          public required string ProfileName { get; set; }
          public string? ProfileBio { get; set; }
          public string? ProfileImageUrl { get; set; }
          public required string Role { get; set; }
          public string? Weapon { get; set; }
          public string? SkillLevel { get; set; }
          public string? ContactInfo { get; set; }
          public bool IsProfileComplete { get; set; }
          public List<BadgeDto> Badges { get; set; } = [];
}

public class BadgeDto
{
          public required string Id { get; set; }
          public required string Code { get; set; }
          public required string Title { get; set; }
          public required string Description { get; set; }
          public DateTime AwardedAt { get; set; }
}
