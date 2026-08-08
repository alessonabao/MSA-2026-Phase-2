using System;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Queries;

public class GetMyAttendedActivities
{
          public class Query : IRequest<List<AttendedActivityDto>>
          {
                    public required string UserId { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Query, List<AttendedActivityDto>>
          {
                    public async Task<List<AttendedActivityDto>> Handle(Query request, CancellationToken cancellationToken)
                    {
                              return await context.ActivityAttendances
                                        .Where(a => a.UserId == request.UserId)
                                        .Join(context.ClubActivities, a => a.ActivityId, activity => activity.Id, (a, activity) => new AttendedActivityDto
                                        {
                                                  Activity = activity,
                                                  IsCancelled = a.IsCancelled,
                                                  CancelledByOrganiser = a.CancelledByOrganiser,
                                                  JoinedAt = a.JoinedAt,
                                                  CancelledAt = a.CancelledAt
                                        })
                                        .OrderByDescending(x => x.Activity.Date)
                                        .ToListAsync(cancellationToken);
                    }
          }
}
