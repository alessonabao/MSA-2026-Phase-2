using System;
using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities.Queries;

public class GetActivityList
{
          public class Query : IRequest<List<ClubActivity>>{}

          public class Handler(AppDbContext context) : IRequestHandler<Query, List<ClubActivity>>
          {
                    public async Task<List<ClubActivity>> Handle(Query request, CancellationToken cancellationToken)
                    {
                              return await context.ClubActivities.ToListAsync(cancellationToken);
                    }
          }
}
