using System;
using backend.Data;
using backend.Models;
using MediatR;

namespace backend.Activities.Commands;

public class CreateActivity
{
          public class Command : IRequest<string>
          {
                    public required ClubActivity ClubActivity { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Command, string>
          {
                    public async Task<string> Handle(Command request, CancellationToken cancellationToken)
                    {
                              context.ClubActivities.Add(request.ClubActivity);
                              await context.SaveChangesAsync(cancellationToken);

                              return request.ClubActivity.Id;
                    }
          }
}
