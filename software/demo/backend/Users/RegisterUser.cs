using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Users;

public class RegisterUser
{
          [Required]
          public string ProfileName { get; set; } = "";

          [Required]
          [EmailAddress]
          public string Email { get; set; } = "";

          [Required]
          public string Password { get; set; } = "";
}
