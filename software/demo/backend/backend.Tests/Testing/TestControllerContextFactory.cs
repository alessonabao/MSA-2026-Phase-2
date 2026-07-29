using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Tests.Testing;

/// <summary>
/// Builds a minimal but functional <see cref="ControllerContext"/> for controller tests,
/// including the handful of DI services (<see cref="ProblemDetailsFactory"/>, logging) that
/// <c>ControllerBase</c> methods like <c>ValidationProblem()</c> need at runtime, plus an
/// optional signed-in <see cref="ClaimsPrincipal"/>.
/// </summary>
public static class TestControllerContextFactory
{
    /// <summary>
    /// Creates a <see cref="ControllerContext"/> with a <see cref="DefaultHttpContext"/> whose
    /// <c>RequestServices</c> can resolve <see cref="ProblemDetailsFactory"/> (needed by
    /// <c>ValidationProblem()</c>) and whose <c>User</c> is either <paramref name="user"/> or an
    /// anonymous, unauthenticated principal.
    /// </summary>
    /// <param name="user">The signed-in principal to attach, or <c>null</c> for an anonymous request.</param>
    public static ControllerContext Create(ClaimsPrincipal? user = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.Configure<ApiBehaviorOptions>(_ => { });
        services.AddSingleton<ProblemDetailsFactory, DefaultProblemDetailsFactory>();

        var httpContext = new DefaultHttpContext
        {
            RequestServices = services.BuildServiceProvider(),
            User = user ?? new ClaimsPrincipal(new ClaimsIdentity())
        };

        return new ControllerContext { HttpContext = httpContext };
    }

    /// <summary>
    /// Builds a <see cref="ClaimsPrincipal"/> that satisfies <c>Identity.IsAuthenticated</c>,
    /// representing a logged-in user for controller actions that branch on authentication state.
    /// </summary>
    /// <param name="name">The value stamped onto the principal's name claim.</param>
    public static ClaimsPrincipal AuthenticatedUser(string name = "test-user")
    {
        var identity = new ClaimsIdentity([new Claim(ClaimTypes.Name, name)], authenticationType: "Test");
        return new ClaimsPrincipal(identity);
    }
}
