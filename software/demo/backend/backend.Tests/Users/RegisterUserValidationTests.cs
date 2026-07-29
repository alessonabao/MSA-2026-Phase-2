using System.ComponentModel.DataAnnotations;
using backend.Users;

namespace backend.Tests.Users;

/// <summary>
/// Tests for the <see cref="System.ComponentModel.DataAnnotations"/> validation attributes on
/// <see cref="RegisterUser"/> (the registration request DTO), independent of any controller.
/// </summary>
public class RegisterUserValidationTests
{
    /// <summary>Runs the same DataAnnotations validation ASP.NET Core model binding would run for a <see cref="RegisterUser"/> instance.</summary>
    /// <param name="model">The instance to validate.</param>
    /// <returns>Every validation failure found; empty when the model is valid.</returns>
    private static IList<ValidationResult> Validate(RegisterUser model)
    {
        var context = new ValidationContext(model);
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(model, context, results, validateAllProperties: true);
        return results;
    }

    /// <summary>Verifies that a model with a valid profile name, email, and password produces no validation errors.</summary>
    [Fact]
    public void Validate_Succeeds_WhenAllFieldsProvided()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a RegisterUser with every required field correctly filled in).
        var model = new RegisterUser
        {
            ProfileName = "Alesson",
            Email = "alesson@test.com",
            Password = "EnGarde!2"
        };

        // Act: perform the single operation being tested (e.g. running DataAnnotations validation over the model).
        var results = Validate(model);

        // Assert: check the outcome matches what was expected (e.g. no validation errors were produced).
        Assert.Empty(results);
    }

    /// <summary>Verifies that a missing profile name, an invalid email, or a missing password each produce a validation error.</summary>
    /// <param name="profileName">The profile name to validate (blank in the missing-name case).</param>
    /// <param name="email">The email to validate (malformed in the invalid-email case).</param>
    /// <param name="password">The password to validate (blank in the missing-password case).</param>
    [Theory]
    [InlineData("", "alesson@test.com", "EnGarde!2")]
    [InlineData("Alesson", "not-an-email", "EnGarde!2")]
    [InlineData("Alesson", "alesson@test.com", "")]
    public void Validate_Fails_WhenRequiredFieldsAreMissingOrInvalid(string profileName, string email, string password)
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a RegisterUser built from this test case's deliberately invalid field values).
        var model = new RegisterUser
        {
            ProfileName = profileName,
            Email = email,
            Password = password
        };

        // Act: perform the single operation being tested (e.g. running DataAnnotations validation over the model).
        var results = Validate(model);

        // Assert: check the outcome matches what was expected (e.g. at least one validation error was produced).
        Assert.NotEmpty(results);
    }
}
