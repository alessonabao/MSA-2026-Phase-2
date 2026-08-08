using System;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Activities;

public static class ActivityBadgeCodes
{
          public const string FirstEventAttended = "first-event-attended";
          public const string FiveEventsAttended = "five-events-attended";
          public const string TenEventsAttended = "ten-events-attended";
          public const string FirstEventCancelled = "first-event-cancelled";
          public const string FiveEventsCancelled = "five-events-cancelled";
}

internal record BadgeTier(int Threshold, string Code, string Title, string Description);

public static class AttendanceBadges
{
          // Ordered smallest threshold first: AwardTiers below relies on this to award any
          // catch-up tiers in one pass (e.g. a user re-joining who jumps straight past the
          // 1-event tier because of seeded/backfilled data).
          private static readonly BadgeTier[] AttendedTiers =
          [
                    new(1, ActivityBadgeCodes.FirstEventAttended, "First Touch", "Joined your first club event."),
                    new(5, ActivityBadgeCodes.FiveEventsAttended, "Regular Fencer", "Joined 5 club events."),
                    new(10, ActivityBadgeCodes.TenEventsAttended, "Club Veteran", "Joined 10 club events."),
          ];

          private static readonly BadgeTier[] CancelledTiers =
          [
                    new(1, ActivityBadgeCodes.FirstEventCancelled, "Change of Plans", "Cancelled your first RSVP."),
                    new(5, ActivityBadgeCodes.FiveEventsCancelled, "Serial Rescheduler", "Cancelled 5 RSVPs."),
          ];

          public static async Task AwardAttendanceBadgesIfEligible(AppDbContext context, string userId)
          {
                    var goingCount = await context.ActivityAttendances
                              .CountAsync(a => a.UserId == userId && !a.IsCancelled);

                    await AwardTiers(context, userId, goingCount, AttendedTiers);
          }

          public static async Task AwardCancellationBadgesIfEligible(AppDbContext context, string userId)
          {
                    // Organiser-driven cancellations don't count here - these badges are for a
                    // member's own choice to back out, not events cancelled out from under them.
                    var cancelledCount = await context.ActivityAttendances
                              .CountAsync(a => a.UserId == userId && a.IsCancelled && !a.CancelledByOrganiser);

                    await AwardTiers(context, userId, cancelledCount, CancelledTiers);
          }

          private static async Task AwardTiers(AppDbContext context, string userId, int count, BadgeTier[] tiers)
          {
                    foreach (var tier in tiers)
                    {
                              if (count < tier.Threshold) continue;

                              var alreadyAwarded = await context.UserBadges
                                        .AnyAsync(b => b.UserId == userId && b.Code == tier.Code);

                              if (alreadyAwarded) continue;

                              context.UserBadges.Add(new UserBadge
                              {
                                        UserId = userId,
                                        Code = tier.Code,
                                        Title = tier.Title,
                                        Description = tier.Description
                              });
                    }

                    await context.SaveChangesAsync();
          }
}
