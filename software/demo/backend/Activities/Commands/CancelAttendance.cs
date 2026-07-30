using System;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Commands;

// Named CancelAttendance (not CancelActivity) to stay distinct from cancelling the event
// itself, which a ClubAdmin does - this only withdraws one member's own RSVP.
public class CancelAttendance
{
          public class Command : IRequest<AttendanceStatusDto>
          {
                    public required string ActivityId { get; set; }
                    public required string UserId { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Command, AttendanceStatusDto>
          {
                    public async Task<AttendanceStatusDto> Handle(Command request, CancellationToken cancellationToken)
                    {
                              var attendance = await context.ActivityAttendances.FirstOrDefaultAsync(
                                        a => a.ActivityId == request.ActivityId && a.UserId == request.UserId && !a.IsCancelled,
                                        cancellationToken);

                              if (attendance == null)
                              {
                                        throw new Exception("You are not currently attending this event");
                              }

                              attendance.IsCancelled = true;
                              attendance.CancelledAt = DateTime.UtcNow;

                              await context.SaveChangesAsync(cancellationToken);
                              await AttendanceBadges.AwardCancellationBadgesIfEligible(context, request.UserId);

                              return new AttendanceStatusDto { IsGoing = false };
                    }
          }
}
