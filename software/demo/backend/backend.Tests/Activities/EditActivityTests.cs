using backend.Activities.Commands;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="EditActivity.Handler"/>, the MediatR handler that maps updated
/// <see cref="backend.Models.ClubActivity"/> fields onto the existing tracked entity.
/// </summary>
public class EditActivityTests
{
    /// <summary>Verifies that editing an existing activity persists the updated field values.</summary>
    [Fact]
    public async Task Handle_UpdatesFieldsOfExistingActivity()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a database seeded with the original activity, a real mapper, and an edited copy sharing the same id).
        using var context = TestDbContextFactory.Create();
        var mapper = TestMapperFactory.Create();
        var activity = TestClubActivityFactory.Create(title: "Original Title");
        context.ClubActivities.Add(activity);
        await context.SaveChangesAsync();

        var edited = TestClubActivityFactory.Create(id: activity.Id, title: "Updated Title");
        var handler = new EditActivity.Handler(context, mapper);

        // Act: perform the single operation being tested (e.g. sending an EditActivity.Command with the edited values).
        await handler.Handle(new EditActivity.Command { ClubActivity = edited }, CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. re-reading the row shows the new title).
        var updated = await context.ClubActivities.FindAsync(activity.Id);
        Assert.NotNull(updated);
        Assert.Equal("Updated Title", updated.Title);
    }

    /// <summary>Verifies that editing an id with no matching row throws instead of silently no-op'ing.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenActivityDoesNotExist()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an empty database, a real mapper, and a command pointing at an id that was never saved).
        using var context = TestDbContextFactory.Create();
        var mapper = TestMapperFactory.Create();
        var handler = new EditActivity.Handler(context, mapper);
        var missing = TestClubActivityFactory.Create(id: "non-existent-id");

        // Act & Assert: perform the operation and check its outcome in one step, since the "result" here is the exception itself (e.g. calling Handle with a missing id should throw).
        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new EditActivity.Command { ClubActivity = missing }, CancellationToken.None));
    }
}
