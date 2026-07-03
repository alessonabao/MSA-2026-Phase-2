using System;
using backend.Data;
using backend.Models;
using MediatR;

namespace backend.Activities.Queries;

public class GetActivityDetails
{
          public class Query : IRequest<ClubActivity>
          {
                    public required string Id { get; set; }
          }

          public class Hander(AppDbContext context) : IRequestHandler<Query, ClubActivity>
          {
                    public async Task<ClubActivity> Handle(Query request, CancellationToken cancellationToken)
                    {
                              var clubActivity = await context.ClubActivities.FindAsync([request.Id], cancellationToken);

                              if(clubActivity == null)
                              {
                                        throw new Exception("Event not found");
                              }

                              return clubActivity;
                    }
          }
}
