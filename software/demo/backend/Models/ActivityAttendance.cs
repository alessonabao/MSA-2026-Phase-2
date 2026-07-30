using System;

namespace backend.Models;

public class ActivityAttendance
{
          public string Id { get; set; } = Guid.NewGuid().ToString();
          public required string ActivityId { get; set; }
          public required string UserId { get; set; }

          // One row per (ActivityId, UserId): re-joining after a cancellation flips this back
          // to false rather than inserting a second row, so badge counts reflect distinct
          // events joined/cancelled, not join/cancel churn on the same event.
          public bool IsCancelled { get; set; }
          public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
          public DateTime? CancelledAt { get; set; }
}
