using System;
using AutoMapper;
using backend.Data;
using backend.Models;
using MediatR;

namespace backend.Activities.Commands;

public class EditActivity
{
          public class Command : IRequest
          {
                    public required ClubActivity ClubActivity { get; set; }
          }

          public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command>
          {
                    public async Task Handle(Command request, CancellationToken cancellationToken)
                    {
                              var clubActivity = await context.ClubActivities.FindAsync([request.ClubActivity.Id], cancellationToken);

                              if(clubActivity == null)
                              {
                                        throw new Exception("Activity not found");
                              }

                              mapper.Map(request.ClubActivity, clubActivity);

                              await context.SaveChangesAsync(cancellationToken);
                    }
          }
}
