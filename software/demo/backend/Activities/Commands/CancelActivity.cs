using System;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Commands;

// Cancelling the event itself (ClubAdmin) - distinct from CancelAttendance, which is a
// member withdrawing their own RSVP. Marks every currently-going attendee's row as
// cancelled by the organiser so it's excluded from their cancellation badge count and
// renders as "Cancelled by Organiser" rather than a self-cancellation in their timeline.
public class CancelActivity
{
          public class Command : IRequest
          {
                    public required string Id { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Command>
          {
                    public async Task Handle(Command request, CancellationToken cancellationToken)
                    {
                              var clubActivity = await context.ClubActivities.FindAsync([request.Id], cancellationToken);

                              if (clubActivity == null)
                              {
                                        throw new Exception("Event not found");
                              }

                              if (clubActivity.IsCancelled)
                              {
                                        throw new Exception("Event is already cancelled");
                              }

                              clubActivity.IsCancelled = true;

                              var attendances = await context.ActivityAttendances
                                        .Where(a => a.ActivityId == request.Id && !a.IsCancelled)
                                        .ToListAsync(cancellationToken);

                              var cancelledAt = DateTime.UtcNow;

                              foreach (var attendance in attendances)
                              {
                                        attendance.IsCancelled = true;
                                        attendance.CancelledByOrganiser = true;
                                        attendance.CancelledAt = cancelledAt;
                              }

                              await context.SaveChangesAsync(cancellationToken);
                    }
          }
}
