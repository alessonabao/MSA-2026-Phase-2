using System;

namespace backend.Activities;

public class AttendeeDto
{
          public required string UserId { get; set; }
          public required string ProfileName { get; set; }
          public string? ProfileImageUrl { get; set; }
}
