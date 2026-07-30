using System;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User : IdentityUser
{
          public string? ProfileName { get; set; }
          public string? ProfileBio { get; set; }
          public string? ProfileImageUrl { get; set; }
          public string? Weapon { get; set; }
          public string? SkillLevel { get; set; }
          public string? ContactInfo { get; set; }
}
