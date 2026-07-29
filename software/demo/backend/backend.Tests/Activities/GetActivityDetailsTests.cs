using backend.Activities.Queries;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="GetActivityDetails.Hander"/>, the MediatR handler that fetches a single
/// <see cref="backend.Models.ClubActivity"/> by id.
/// </summary>
public class GetActivityDetailsTests
{
    /// <summary>Verifies that querying an existing activity's id returns that same activity.</summary>
    [Fact]
    public async Task Handle_ReturnsActivity_WhenItExists()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a database seeded with one activity, and the handler under test).
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        context.ClubActivities.Add(activity);
        await context.SaveChangesAsync();

        var handler = new GetActivityDetails.Hander(context);

        // Act: perform the single operation being tested (e.g. sending a GetActivityDetails.Query for that activity's id).
        var result = await handler.Handle(new GetActivityDetails.Query { Id = activity.Id }, CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. the returned activity's id and title match the seeded row).
        Assert.Equal(activity.Id, result.Id);
        Assert.Equal(activity.Title, result.Title);
    }

    /// <summary>Verifies that querying an id with no matching row throws instead of returning null.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenActivityDoesNotExist()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an empty database and the handler under test).
        using var context = TestDbContextFactory.Create();
        var handler = new GetActivityDetails.Hander(context);

        // Act & Assert: perform the operation and check its outcome in one step, since the "result" here is the exception itself (e.g. querying an id that doesn't exist should throw).
        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new GetActivityDetails.Query { Id = "non-existent-id" }, CancellationToken.None));
    }
}
