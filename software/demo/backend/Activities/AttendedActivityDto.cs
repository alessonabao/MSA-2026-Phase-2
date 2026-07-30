using System;
using backend.Models;

namespace backend.Activities;

public class AttendedActivityDto
{
          public required ClubActivity Activity { get; set; }
          public bool IsCancelled { get; set; }
          public DateTime JoinedAt { get; set; }
          public DateTime? CancelledAt { get; set; }
}
