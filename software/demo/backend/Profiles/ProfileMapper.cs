using System;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Profiles;

public static class ProfileBadgeCodes
{
          public const string ProfileComplete = "profile-complete";
}

public static class ProfileMapper
{
          public static async Task<ProfileDto> ToDto(AppDbContext context, UserManager<User> userManager, User user)
          {
                    var roles = await userManager.GetRolesAsync(user);
                    var role = roles.FirstOrDefault() ?? Roles.Member;
                    var isMember = role == Roles.Member;

                    var badges = await context.UserBadges
                              .Where(b => b.UserId == user.Id)
                              .OrderBy(b => b.AwardedAt)
                              .Select(b => new BadgeDto
                              {
                                        Id = b.Id,
                                        Code = b.Code,
                                        Title = b.Title,
                                        Description = b.Description,
                                        AwardedAt = b.AwardedAt
                              })
                              .ToListAsync();

                    return new ProfileDto
                    {
                              Id = user.Id,
                              Email = user.Email!,
                              ProfileName = user.ProfileName ?? "",
                              ProfileBio = user.ProfileBio,
                              ProfileImageUrl = user.ProfileImageUrl,
                              Role = role,
                              Weapon = isMember ? user.Weapon : null,
                              SkillLevel = isMember ? user.SkillLevel : null,
                              ContactInfo = !isMember ? user.ContactInfo : null,
                              IsProfileComplete = isMember && IsProfileComplete(user),
                              Badges = badges
                    };
          }

          public static bool IsProfileComplete(User user) =>
                    !string.IsNullOrWhiteSpace(user.ProfileBio) &&
                    !string.IsNullOrWhiteSpace(user.ProfileImageUrl) &&
                    !string.IsNullOrWhiteSpace(user.Weapon) &&
                    !string.IsNullOrWhiteSpace(user.SkillLevel);

          public static async Task AwardProfileCompleteBadgeIfEligible(AppDbContext context, User user)
          {
                    if (!IsProfileComplete(user)) return;

                    var alreadyAwarded = await context.UserBadges
                              .AnyAsync(b => b.UserId == user.Id && b.Code == ProfileBadgeCodes.ProfileComplete);

                    if (alreadyAwarded) return;

                    context.UserBadges.Add(new UserBadge
                    {
                              UserId = user.Id,
                              Code = ProfileBadgeCodes.ProfileComplete,
                              Title = "Profile Complete",
                              Description = "Completed every section of your fencer profile."
                    });

                    await context.SaveChangesAsync();
          }
}
