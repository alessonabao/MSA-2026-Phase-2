using System;
using backend.Data;
using MediatR;

namespace backend.Activities.Commands;

public class DeleteActivity
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

                              if(clubActivity == null)
                              {
                                        throw new Exception("Activity not found");
                              }

                              context.Remove(clubActivity);
                              await context.SaveChangesAsync(cancellationToken);
                    }
          }
}
