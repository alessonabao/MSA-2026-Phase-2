using System;
using backend.Data;
using MediatR;

namespace backend.Activities.Commands;

// Reopens a previously cancelled event. Deliberately does not restore attendees' RSVPs -
// rows CancelActivity marked CancelledByOrganiser stay cancelled, so members have to
// rejoin themselves rather than being silently re-added to an event they were told about.
public class ResumeActivity
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

                              if (!clubActivity.IsCancelled)
                              {
                                        throw new Exception("Event is not cancelled");
                              }

                              clubActivity.IsCancelled = false;

                              await context.SaveChangesAsync(cancellationToken);
                    }
          }
}
