using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace backend.Tests.Testing;

/// <summary>
/// Builds Moq-based <see cref="UserManager{TUser}"/> and <see cref="SignInManager{TUser}"/>
/// mocks for <see cref="User"/>, so controller tests can stub out ASP.NET Core Identity
/// behavior (create/find users, sign out) without a real database or HTTP pipeline.
/// </summary>
public static class TestIdentityFactory
{
    /// <summary>
    /// Creates a mockable <see cref="UserManager{TUser}"/> for <see cref="User"/>. All
    /// constructor dependencies besides the user store are passed as <c>null</c> because
    /// <see cref="UserManager{TUser}"/>'s virtual members (e.g. <c>CreateAsync</c>,
    /// <c>GetUserAsync</c>) are the only ones tests need to configure via <c>Setup</c>.
    /// </summary>
    public static Mock<UserManager<User>> MockUserManager()
    {
        var store = new Mock<IUserStore<User>>();
        return new Mock<UserManager<User>>(store.Object, null!, null!, null!, null!, null!, null!, null!, null!);
    }

    /// <summary>
    /// Creates a mockable <see cref="SignInManager{TUser}"/> wired to the given
    /// <paramref name="userManager"/>, so a controller under test can read
    /// <c>SignInManager.UserManager</c> and have it resolve back to the same mock.
    /// </summary>
    public static Mock<SignInManager<User>> MockSignInManager(UserManager<User> userManager)
    {
        var contextAccessor = new Mock<IHttpContextAccessor>();
        var claimsFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

        return new Mock<SignInManager<User>>(
            userManager,
            contextAccessor.Object,
            claimsFactory.Object,
            null!,
            null!,
            null!,
            null!);
    }
}
