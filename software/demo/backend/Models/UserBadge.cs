using System;

namespace backend.Models;

public class UserBadge
{
          public string Id { get; set; } = Guid.NewGuid().ToString();
          public required string UserId { get; set; }
          public required string Code { get; set; }
          public required string Title { get; set; }
          public required string Description { get; set; }
          public DateTime AwardedAt { get; set; } = DateTime.UtcNow;
}
