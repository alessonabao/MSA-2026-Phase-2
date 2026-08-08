using System;
using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Commands;

public class JoinActivity
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
                              var activityExists = await context.ClubActivities.AnyAsync(a => a.Id == request.ActivityId, cancellationToken);

                              if (!activityExists)
                              {
                                        throw new Exception("Event not found");
                              }

                              var attendance = await context.ActivityAttendances.FirstOrDefaultAsync(
                                        a => a.ActivityId == request.ActivityId && a.UserId == request.UserId,
                                        cancellationToken);

                              if (attendance == null)
                              {
                                        context.ActivityAttendances.Add(new ActivityAttendance
                                        {
                                                  ActivityId = request.ActivityId,
                                                  UserId = request.UserId
                                        });
                              }
                              else
                              {
                                        // Re-joining after a previous cancellation - flip the same row back
                                        // rather than inserting a second one (ActivityId, UserId is unique).
                                        attendance.IsCancelled = false;
                                        attendance.CancelledAt = null;
                                        attendance.CancelledByOrganiser = false;
                              }

                              await context.SaveChangesAsync(cancellationToken);
                              await AttendanceBadges.AwardAttendanceBadgesIfEligible(context, request.UserId);

                              return new AttendanceStatusDto { IsGoing = true };
                    }
          }
}
