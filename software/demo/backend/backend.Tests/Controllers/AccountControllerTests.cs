using System.Security.Claims;
using backend.Controllers;
using backend.Models;
using backend.Tests.Testing;
using backend.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

/// <summary>
/// Tests for <see cref="AccountController"/>: registration, logout, and the current-user-info
/// endpoint, exercised against mocked <see cref="UserManager{TUser}"/>/<see cref="SignInManager{TUser}"/>
/// instances instead of a real Identity store.
/// </summary>
public class AccountControllerTests
{
    /// <summary>
    /// Builds an <see cref="AccountController"/> wired to mocked Identity managers and a
    /// minimal <see cref="Microsoft.AspNetCore.Mvc.ControllerContext"/>, so each test can just
    /// configure the manager mocks it needs and call the controller action directly.
    /// </summary>
    /// <param name="principal">The signed-in user to attach to the request, or <c>null</c> for an anonymous request.</param>
    private static (AccountController Controller, Mock<UserManager<User>> UserManager, Mock<SignInManager<User>> SignInManager)
        CreateController(ClaimsPrincipal? principal = null)
    {
        var userManagerMock = TestIdentityFactory.MockUserManager();
        var signInManagerMock = TestIdentityFactory.MockSignInManager(userManagerMock.Object);

        var controller = new AccountController(signInManagerMock.Object)
        {
            ControllerContext = TestControllerContextFactory.Create(principal)
        };

        return (controller, userManagerMock, signInManagerMock);
    }

    /// <summary>Verifies that registering with valid details returns 200 OK once <c>UserManager.CreateAsync</c> succeeds.</summary>
    [Fact]
    public async Task RegisterUser_ReturnsOk_WhenCreationSucceeds()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a controller whose mocked UserManager is stubbed to report a successful user creation and role assignment).
        var (controller, userManager, _) = CreateController();
        userManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
        userManager
            .Setup(x => x.AddToRoleAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act: perform the single operation being tested (e.g. calling RegisterUser with a valid registration request).
        var result = await controller.RegisterUser(new RegisterUser
        {
            ProfileName = "Alesson",
            Email = "alesson@test.com",
            Password = "EnGarde!2"
        });

        // Assert: check the outcome matches what was expected (e.g. the action returned a plain 200 OK result, and the new user was assigned the default Member role).
        Assert.IsType<OkResult>(result);
        userManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), Roles.Member), Times.Once);
    }

    /// <summary>Verifies that a failed <c>UserManager.CreateAsync</c> (e.g. duplicate email) surfaces as a 400 validation problem.</summary>
    [Fact]
    public async Task RegisterUser_ReturnsValidationProblem_WhenCreationFails()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a controller whose mocked UserManager is stubbed to report a duplicate-email failure).
        var (controller, userManager, _) = CreateController();
        userManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError
            {
                Code = "DuplicateEmail",
                Description = "Email 'alesson@test.com' is already taken."
            }));

        // Act: perform the single operation being tested (e.g. calling RegisterUser with that same email).
        var result = await controller.RegisterUser(new RegisterUser
        {
            ProfileName = "Alesson",
            Email = "alesson@test.com",
            Password = "EnGarde!2"
        });

        // Assert: check the outcome matches what was expected (e.g. the action returned a 400 Bad Request wrapping the validation error).
        Assert.IsType<BadRequestObjectResult>(result);
    }

    /// <summary>Verifies that logging out signs the user out and returns 204 No Content.</summary>
    [Fact]
    public async Task Logout_SignsOutAndReturnsNoContent()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a controller whose mocked SignInManager is stubbed to complete SignOutAsync successfully).
        var (controller, _, signInManager) = CreateController();
        signInManager.Setup(x => x.SignOutAsync()).Returns(Task.CompletedTask);

        // Act: perform the single operation being tested (e.g. calling Logout).
        var result = await controller.Logout();

        // Assert: check the outcome matches what was expected (e.g. the action returned 204 No Content and SignOutAsync was actually invoked).
        Assert.IsType<NoContentResult>(result);
        signInManager.Verify(x => x.SignOutAsync(), Times.Once);
    }

    /// <summary>Verifies that requesting user info as an anonymous (unauthenticated) caller returns 204 No Content.</summary>
    [Fact]
    public async Task GetUserInfo_ReturnsNoContent_WhenUserIsNotAuthenticated()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a controller created with no signed-in principal).
        var (controller, _, _) = CreateController();

        // Act: perform the single operation being tested (e.g. calling GetUserInfo).
        var result = await controller.GetUserInfo();

        // Assert: check the outcome matches what was expected (e.g. the action short-circuits to 204 No Content without touching UserManager).
        Assert.IsType<NoContentResult>(result);
    }

    /// <summary>Verifies that an authenticated principal with no matching Identity user (e.g. a deleted account) returns 401 Unauthorized.</summary>
    [Fact]
    public async Task GetUserInfo_ReturnsUnauthorized_WhenAuthenticatedPrincipalHasNoMatchingUser()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an authenticated principal whose UserManager.GetUserAsync lookup is stubbed to return null).
        var principal = TestControllerContextFactory.AuthenticatedUser();
        var (controller, userManager, _) = CreateController(principal);
        userManager
            .Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync((User?)null);

        // Act: perform the single operation being tested (e.g. calling GetUserInfo).
        var result = await controller.GetUserInfo();

        // Assert: check the outcome matches what was expected (e.g. the action returned 401 Unauthorized).
        Assert.IsType<UnauthorizedResult>(result);
    }

    /// <summary>Verifies that an authenticated principal with a matching Identity user returns 200 OK with that user's profile details.</summary>
    [Fact]
    public async Task GetUserInfo_ReturnsOkWithUserDetails_WhenUserExists()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an authenticated principal whose UserManager.GetUserAsync lookup is stubbed to return a matching user).
        var principal = TestControllerContextFactory.AuthenticatedUser();
        var (controller, userManager, _) = CreateController(principal);
        var user = new User
        {
            Id = "user-1",
            Email = "alesson@test.com",
            ProfileName = "Alesson",
            ProfileImageUrl = null
        };
        userManager
            .Setup(x => x.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync(user);
        userManager
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync([Roles.Member]);

        // Act: perform the single operation being tested (e.g. calling GetUserInfo).
        var result = await controller.GetUserInfo();

        // Assert: check the outcome matches what was expected (e.g. the action returned 200 OK carrying that user's profile details).
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }
}
