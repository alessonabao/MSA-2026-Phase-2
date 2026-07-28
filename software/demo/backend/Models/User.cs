using System;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class User : IdentityUser
{
          public string? ProfileName { get; set; }
          public string? ProfileBio { get; set; }
          public string? ProfileImageUrl { get; set; }
}
