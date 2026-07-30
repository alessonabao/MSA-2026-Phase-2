using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Profiles;

public class UpdateProfileRequest
{
          [Required]
          public string ProfileName { get; set; } = "";

          public string? ProfileBio { get; set; }
          public string? Weapon { get; set; }
          public string? SkillLevel { get; set; }
          public string? ContactInfo { get; set; }
}
