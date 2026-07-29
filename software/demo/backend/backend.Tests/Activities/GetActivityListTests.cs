using backend.Activities.Queries;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="GetActivityList.Handler"/>, the MediatR handler that returns every
/// <see cref="backend.Models.ClubActivity"/> in the database.
/// </summary>
public class GetActivityListTests
{
    /// <summary>Verifies that querying an empty database returns an empty list rather than null or throwing.</summary>
    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenNoActivitiesExist()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a fresh, empty database and the handler under test).
        using var context = TestDbContextFactory.Create();
        var handler = new GetActivityList.Handler(context);

        // Act: perform the single operation being tested (e.g. sending a GetActivityList.Query).
        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. the returned list has no items).
        Assert.Empty(result);
    }

    /// <summary>Verifies that querying a database with multiple activities returns all of them.</summary>
    [Fact]
    public async Task Handle_ReturnsAllActivitiesInDatabase()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a database seeded with two activities, and the handler under test).
        using var context = TestDbContextFactory.Create();
        context.ClubActivities.AddRange(
            TestClubActivityFactory.Create(title: "Activity One"),
            TestClubActivityFactory.Create(title: "Activity Two"));
        await context.SaveChangesAsync();

        var handler = new GetActivityList.Handler(context);

        // Act: perform the single operation being tested (e.g. sending a GetActivityList.Query).
        var result = await handler.Handle(new GetActivityList.Query(), CancellationToken.None);

        // Assert: check the outcome matches what was expected (e.g. both seeded activities come back).
        Assert.Equal(2, result.Count);
    }
}
