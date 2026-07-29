using backend.Activities.Commands;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="DeleteActivity.Handler"/>, the MediatR handler that removes a
/// <see cref="backend.Models.ClubActivity"/> by id.
/// </summary>
public class DeleteActivityTests
{
    /// <summary>Verifies that deleting an existing activity removes it from the database.</summary>
    [Fact]
    public async Task Handle_RemovesExistingActivity()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a fresh database seeded with one activity, and the handler under test).
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        context.ClubActivities.Add(activity);
        await context.SaveChangesAsync();

        var handler = new DeleteActivity.Handler(context);

        // Act: perform the single operation being tested (e.g. sending a DeleteActivity.Command for that activity's id).
        await handler.Handle(new DeleteActivity.Command { Id = activity.Id }, CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. the activities table is now empty).
        Assert.Empty(context.ClubActivities);
    }

    /// <summary>Verifies that deleting an id with no matching row throws instead of silently no-op'ing.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenActivityDoesNotExist()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an empty database and the handler under test).
        using var context = TestDbContextFactory.Create();
        var handler = new DeleteActivity.Handler(context);

        // Act & Assert: perform the operation and check its outcome in one step, since the "result" here is the exception itself (e.g. calling Handle with an id that doesn't exist should throw).
        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new DeleteActivity.Command { Id = "non-existent-id" }, CancellationToken.None));
    }
}
