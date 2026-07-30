using System;
using backend.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Queries;

public class GetActivityAttendance
{
          public class Query : IRequest<AttendanceStatusDto>
          {
                    public required string ActivityId { get; set; }
                    public required string UserId { get; set; }
          }

          public class Handler(AppDbContext context) : IRequestHandler<Query, AttendanceStatusDto>
          {
                    public async Task<AttendanceStatusDto> Handle(Query request, CancellationToken cancellationToken)
                    {
                              var isGoing = await context.ActivityAttendances.AnyAsync(
                                        a => a.ActivityId == request.ActivityId && a.UserId == request.UserId && !a.IsCancelled,
                                        cancellationToken);

                              return new AttendanceStatusDto { IsGoing = isGoing };
                    }
          }
}
