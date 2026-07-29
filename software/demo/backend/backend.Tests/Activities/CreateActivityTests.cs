using backend.Activities.Commands;
using backend.Tests.Testing;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="CreateActivity.Handler"/>, the MediatR handler that persists a new
/// <see cref="backend.Models.ClubActivity"/> and returns its id.
/// </summary>
public class CreateActivityTests
{
    /// <summary>
    /// Verifies that handling a <see cref="CreateActivity.Command"/> both saves the activity to
    /// the database and returns the same id the caller supplied on it.
    /// </summary>
    [Fact]
    public async Task Handle_AddsActivityToDatabase_AndReturnsItsId()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a fresh database, the handler under test, and the activity to create).
        using var context = TestDbContextFactory.Create();
        var handler = new CreateActivity.Handler(context);
        var activity = TestClubActivityFactory.Create();

        // Act: perform the single operation being tested (e.g. sending the CreateActivity.Command through the handler).
        var resultId = await handler.Handle(new CreateActivity.Command { ClubActivity = activity }, CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. the returned id matches, and the row now exists in the database).
        Assert.Equal(activity.Id, resultId);
        var saved = await context.ClubActivities.SingleOrDefaultAsync(a => a.Id == activity.Id);
        Assert.NotNull(saved);
        Assert.Equal(activity.Title, saved.Title);
    }
}
