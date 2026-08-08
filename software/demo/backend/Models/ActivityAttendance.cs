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

          // True when IsCancelled was set by a ClubAdmin cancelling the whole event, rather
          // than the member withdrawing their own RSVP. Keeps organiser-driven cancellations
          // out of the member's cancellation badge count and out of their control - it's
          // something that happened to them, not a choice they made.
          public bool CancelledByOrganiser { get; set; }
}
