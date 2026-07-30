using backend.Models;
using backend.Profiles.Queries;
using backend.Tests.Testing;
using Moq;

namespace backend.Tests.Profiles;

/// <summary>
/// Tests for <see cref="GetProfile.Handler"/>: confirms the returned <see cref="backend.Profiles.ProfileDto"/>
/// exposes the right fields for each role (Members get Weapon/SkillLevel, ClubAdmins get ContactInfo).
/// </summary>
public class GetProfileTests
{
    [Fact]
    public async Task Handle_ReturnsWeaponAndSkillLevel_AndHidesContactInfo_ForMember()
    {
        // Arrange: a member with every field set, including a ContactInfo value that should never surface for a Member.
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create(weapon: "Foil", skillLevel: "Beginner", contactInfo: "should not appear");
        var userManager = TestIdentityFactory.MockUserManager();
        userManager.Setup(x => x.FindByIdAsync(user.Id)).ReturnsAsync(user);
        userManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync([Roles.Member]);
        var handler = new GetProfile.Handler(context, userManager.Object);

        // Act
        var dto = await handler.Handle(new GetProfile.Query { UserId = user.Id }, CancellationToken.None);

        // Assert
        Assert.Equal(Roles.Member, dto.Role);
        Assert.Equal("Foil", dto.Weapon);
        Assert.Equal("Beginner", dto.SkillLevel);
        Assert.Null(dto.ContactInfo);
    }

    [Fact]
    public async Task Handle_ReturnsContactInfo_AndHidesWeaponAndSkillLevel_ForClubAdmin()
    {
        // Arrange: a ClubAdmin with every field set, including Weapon/SkillLevel that should never surface for an admin.
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create(weapon: "Foil", skillLevel: "Beginner", contactInfo: "Email: club@test.com");
        var userManager = TestIdentityFactory.MockUserManager();
        userManager.Setup(x => x.FindByIdAsync(user.Id)).ReturnsAsync(user);
        userManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync([Roles.ClubAdmin]);
        var handler = new GetProfile.Handler(context, userManager.Object);

        // Act
        var dto = await handler.Handle(new GetProfile.Query { UserId = user.Id }, CancellationToken.None);

        // Assert
        Assert.Equal(Roles.ClubAdmin, dto.Role);
        Assert.Null(dto.Weapon);
        Assert.Null(dto.SkillLevel);
        Assert.Equal("Email: club@test.com", dto.ContactInfo);
    }

    [Fact]
    public async Task Handle_Throws_WhenUserNotFound()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var userManager = TestIdentityFactory.MockUserManager();
        userManager.Setup(x => x.FindByIdAsync("missing")).ReturnsAsync((User?)null);
        var handler = new GetProfile.Handler(context, userManager.Object);

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new GetProfile.Query { UserId = "missing" }, CancellationToken.None));
    }
}
