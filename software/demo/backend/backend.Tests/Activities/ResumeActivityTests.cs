using backend.Activities.Commands;
using backend.Models;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="ResumeActivity.Handler"/>, the MediatR handler a ClubAdmin uses to
/// reopen a previously cancelled event.
/// </summary>
public class ResumeActivityTests
{
    /// <summary>Verifies that resuming a cancelled event un-flags it but leaves attendee rows as-is.</summary>
    [Fact]
    public async Task Handle_ResumesEventWithoutRestoringAttendance()
    {
        // Arrange: a cancelled event with an attendee who was cancelled by the organiser.
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        activity.IsCancelled = true;
        context.ClubActivities.Add(activity);
        context.ActivityAttendances.Add(new ActivityAttendance
        {
            ActivityId = activity.Id,
            UserId = "attendee-1",
            IsCancelled = true,
            CancelledByOrganiser = true,
            CancelledAt = new DateTime(2026, 8, 1),
        });
        await context.SaveChangesAsync();

        var handler = new ResumeActivity.Handler(context);

        // Act
        await handler.Handle(new ResumeActivity.Command { Id = activity.Id }, CancellationToken.None);

        // Assert: the event is open again, but the attendee has to rejoin themselves.
        Assert.False(activity.IsCancelled);

        var attendance = Assert.Single(context.ActivityAttendances);
        Assert.True(attendance.IsCancelled);
        Assert.True(attendance.CancelledByOrganiser);
    }

    /// <summary>Verifies that resuming an id with no matching row throws instead of silently no-op'ing.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenActivityDoesNotExist()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new ResumeActivity.Handler(context);

        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new ResumeActivity.Command { Id = "non-existent-id" }, CancellationToken.None));
    }

    /// <summary>Verifies that resuming an event that isn't cancelled throws.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenNotCancelled()
    {
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        context.ClubActivities.Add(activity);
        await context.SaveChangesAsync();

        var handler = new ResumeActivity.Handler(context);

        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new ResumeActivity.Command { Id = activity.Id }, CancellationToken.None));
    }
}
