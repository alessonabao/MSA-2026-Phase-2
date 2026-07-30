using System;
using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Profiles.Commands;

public class UpdateProfile
{
          public class Command : IRequest<ProfileDto>
          {
                    public required string UserId { get; set; }
                    public required string ProfileName { get; set; }
                    public string? ProfileBio { get; set; }
                    public string? Weapon { get; set; }
                    public string? SkillLevel { get; set; }
                    public string? ContactInfo { get; set; }
          }

          public class Handler(AppDbContext context, UserManager<User> userManager) : IRequestHandler<Command, ProfileDto>
          {
                    public async Task<ProfileDto> Handle(Command request, CancellationToken cancellationToken)
                    {
                              var user = await userManager.FindByIdAsync(request.UserId);

                              if (user == null)
                              {
                                        throw new Exception("User not found");
                              }

                              var isAdmin = await userManager.IsInRoleAsync(user, Roles.ClubAdmin);

                              user.ProfileName = request.ProfileName;
                              user.ProfileBio = request.ProfileBio;

                              if (isAdmin)
                              {
                                        user.ContactInfo = request.ContactInfo;
                              }
                              else
                              {
                                        user.Weapon = request.Weapon;
                                        user.SkillLevel = request.SkillLevel;
                              }

                              await userManager.UpdateAsync(user);

                              if (!isAdmin)
                              {
                                        await ProfileMapper.AwardProfileCompleteBadgeIfEligible(context, user);
                              }

                              return await ProfileMapper.ToDto(context, userManager, user);
                    }
          }
}
