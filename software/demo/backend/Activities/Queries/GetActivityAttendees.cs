using System;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Queries;

public class GetActivityAttendees
{
          public class Query : IRequest<List<AttendeeDto>>
          {
                    public required string ActivityId { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Query, List<AttendeeDto>>
          {
                    public async Task<List<AttendeeDto>> Handle(Query request, CancellationToken cancellationToken)
                    {
                              return await context.ActivityAttendances
                                        .Where(a => a.ActivityId == request.ActivityId && !a.IsCancelled)
                                        .Join(context.Users, a => a.UserId, u => u.Id, (a, u) => new AttendeeDto
                                        {
                                                  UserId = u.Id,
                                                  ProfileName = u.ProfileName ?? u.Email ?? u.Id,
                                                  ProfileImageUrl = u.ProfileImageUrl
                                        })
                                        .OrderBy(a => a.ProfileName)
                                        .ToListAsync(cancellationToken);
                    }
          }
}
