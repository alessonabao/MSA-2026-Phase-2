using backend.Models;
using backend.Profiles;
using backend.Profiles.Commands;
using backend.Tests.Testing;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace backend.Tests.Profiles;

/// <summary>
/// Tests for <see cref="UpdateProfile.Handler"/>: role-based field routing (Members can only
/// change Weapon/SkillLevel, ClubAdmins can only change ContactInfo) and the profile-completion
/// badge award/no-double-award behavior.
/// </summary>
public class UpdateProfileTests
{
    private static Mock<UserManager<User>> SetupUserManager(User user, string role)
    {
        var userManager = TestIdentityFactory.MockUserManager();
        userManager.Setup(x => x.FindByIdAsync(user.Id)).ReturnsAsync(user);
        userManager.Setup(x => x.IsInRoleAsync(user, Roles.ClubAdmin)).ReturnsAsync(role == Roles.ClubAdmin);
        userManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync([role]);
        userManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
        return userManager;
    }

    [Fact]
    public async Task Handle_UpdatesMemberFields_AndIgnoresContactInfo()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create();
        var userManager = SetupUserManager(user, Roles.Member);
        var handler = new UpdateProfile.Handler(context, userManager.Object);

        // Act: a Member submits a ContactInfo value too - it should be silently ignored server-side.
        var dto = await handler.Handle(new UpdateProfile.Command
        {
            UserId = user.Id,
            ProfileName = "New Name",
            ProfileBio = "New bio",
            Weapon = "Sabre",
            SkillLevel = "Advanced",
            ContactInfo = "should be ignored"
        }, CancellationToken.None);

        // Assert
        Assert.Equal("New Name", user.ProfileName);
        Assert.Equal("Sabre", user.Weapon);
        Assert.Equal("Advanced", user.SkillLevel);
        Assert.Null(user.ContactInfo);
        Assert.Equal("Sabre", dto.Weapon);
        Assert.Null(dto.ContactInfo);
    }

    [Fact]
    public async Task Handle_UpdatesAdminContactInfo_AndIgnoresWeaponAndSkillLevel()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create();
        var userManager = SetupUserManager(user, Roles.ClubAdmin);
        var handler = new UpdateProfile.Handler(context, userManager.Object);

        // Act: a ClubAdmin submits Weapon/SkillLevel too - it should be silently ignored server-side.
        var dto = await handler.Handle(new UpdateProfile.Command
        {
            UserId = user.Id,
            ProfileName = "Club Admin",
            ProfileBio = "Bio",
            Weapon = "should be ignored",
            SkillLevel = "should be ignored",
            ContactInfo = "Email: admin@test.com"
        }, CancellationToken.None);

        // Assert
        Assert.Null(user.Weapon);
        Assert.Null(user.SkillLevel);
        Assert.Equal("Email: admin@test.com", user.ContactInfo);
        Assert.Equal("Email: admin@test.com", dto.ContactInfo);
        Assert.Null(dto.Weapon);
    }

    [Fact]
    public async Task Handle_AwardsProfileCompleteBadge_WhenMemberCompletesProfile()
    {
        // Arrange: a member who already has a picture, and is now saving the last missing fields.
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create(profileImageUrl: "/uploads/profile-pictures/x.png");
        var userManager = SetupUserManager(user, Roles.Member);
        var handler = new UpdateProfile.Handler(context, userManager.Object);

        // Act
        var dto = await handler.Handle(new UpdateProfile.Command
        {
            UserId = user.Id,
            ProfileName = "Complete User",
            ProfileBio = "Bio",
            Weapon = "Foil",
            SkillLevel = "Beginner"
        }, CancellationToken.None);

        // Assert
        var badge = Assert.Single(dto.Badges);
        Assert.Equal(ProfileBadgeCodes.ProfileComplete, badge.Code);
        Assert.Single(await context.UserBadges.Where(b => b.UserId == user.Id).ToListAsync());
    }

    [Fact]
    public async Task Handle_DoesNotAwardBadgeTwice_WhenProfileWasAlreadyComplete()
    {
        // Arrange: profile is already complete and already has the badge from a previous save.
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create(profileImageUrl: "/uploads/profile-pictures/x.png");
        context.UserBadges.Add(new UserBadge
        {
            UserId = user.Id,
            Code = ProfileBadgeCodes.ProfileComplete,
            Title = "Profile Complete",
            Description = "Completed every section of your fencer profile."
        });
        await context.SaveChangesAsync();
        var userManager = SetupUserManager(user, Roles.Member);
        var handler = new UpdateProfile.Handler(context, userManager.Object);

        // Act: saving again with the profile still complete (e.g. just an edited bio).
        var dto = await handler.Handle(new UpdateProfile.Command
        {
            UserId = user.Id,
            ProfileName = "Complete User",
            ProfileBio = "Bio, edited again",
            Weapon = "Foil",
            SkillLevel = "Beginner"
        }, CancellationToken.None);

        // Assert: still exactly one badge, not two.
        Assert.Single(dto.Badges);
        Assert.Single(await context.UserBadges.Where(b => b.UserId == user.Id).ToListAsync());
    }
}
