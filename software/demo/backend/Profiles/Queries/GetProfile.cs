using System;
using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Profiles.Queries;

public class GetProfile
{
          public class Query : IRequest<ProfileDto>
          {
                    public required string UserId { get; set; }
          }

          public class Handler(AppDbContext context, UserManager<User> userManager) : IRequestHandler<Query, ProfileDto>
          {
                    public async Task<ProfileDto> Handle(Query request, CancellationToken cancellationToken)
                    {
                              var user = await userManager.FindByIdAsync(request.UserId);

                              if (user == null)
                              {
                                        throw new Exception("User not found");
                              }

                              return await ProfileMapper.ToDto(context, userManager, user);
                    }
          }
}
