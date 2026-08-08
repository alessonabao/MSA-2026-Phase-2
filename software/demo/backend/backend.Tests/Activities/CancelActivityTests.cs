using backend.Activities;
using backend.Activities.Commands;
using backend.Models;
using backend.Tests.Testing;

namespace backend.Tests.Activities;

/// <summary>
/// Tests for <see cref="CancelActivity.Handler"/>, the MediatR handler a ClubAdmin uses to
/// cancel an event, distinct from <see cref="CancelAttendance.Handler"/> which is a member
/// withdrawing their own RSVP.
/// </summary>
public class CancelActivityTests
{
    /// <summary>Verifies that cancelling an event flags it and every going attendee's row.</summary>
    [Fact]
    public async Task Handle_CancelsEventAndGoingAttendees()
    {
        // Arrange: a fresh database with one activity and one member currently attending it.
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        context.ClubActivities.Add(activity);
        context.ActivityAttendances.Add(new ActivityAttendance
        {
            ActivityId = activity.Id,
            UserId = "attendee-1",
        });
        await context.SaveChangesAsync();

        var handler = new CancelActivity.Handler(context);

        // Act: the ClubAdmin cancels the event.
        await handler.Handle(new CancelActivity.Command { Id = activity.Id }, CancellationToken.None);

        // Assert: the event and the attendee's row are both cancelled, and the attendee's
        // cancellation is attributed to the organiser rather than to their own choice.
        Assert.True(activity.IsCancelled);

        var attendance = Assert.Single(context.ActivityAttendances);
        Assert.True(attendance.IsCancelled);
        Assert.True(attendance.CancelledByOrganiser);
        Assert.NotNull(attendance.CancelledAt);
    }

    /// <summary>Verifies that attendees who had already cancelled their own RSVP are left alone.</summary>
    [Fact]
    public async Task Handle_DoesNotTouchAlreadyCancelledAttendance()
    {
        // Arrange: an attendee who cancelled their own RSVP before the organiser cancels the event.
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        context.ClubActivities.Add(activity);
        context.ActivityAttendances.Add(new ActivityAttendance
        {
            ActivityId = activity.Id,
            UserId = "attendee-1",
            IsCancelled = true,
            CancelledAt = new DateTime(2026, 8, 1),
        });
        await context.SaveChangesAsync();

        var handler = new CancelActivity.Handler(context);

        // Act
        await handler.Handle(new CancelActivity.Command { Id = activity.Id }, CancellationToken.None);

        // Assert: the pre-existing self-cancellation isn't reattributed to the organiser.
        var attendance = Assert.Single(context.ActivityAttendances);
        Assert.False(attendance.CancelledByOrganiser);
        Assert.Equal(new DateTime(2026, 8, 1), attendance.CancelledAt);
    }

    /// <summary>Verifies that cancelling an id with no matching row throws instead of silently no-op'ing.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenActivityDoesNotExist()
    {
        using var context = TestDbContextFactory.Create();
        var handler = new CancelActivity.Handler(context);

        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new CancelActivity.Command { Id = "non-existent-id" }, CancellationToken.None));
    }

    /// <summary>Verifies that cancelling an already-cancelled event throws rather than re-cancelling it.</summary>
    [Fact]
    public async Task Handle_ThrowsWhenAlreadyCancelled()
    {
        using var context = TestDbContextFactory.Create();
        var activity = TestClubActivityFactory.Create();
        activity.IsCancelled = true;
        context.ClubActivities.Add(activity);
        await context.SaveChangesAsync();

        var handler = new CancelActivity.Handler(context);

        await Assert.ThrowsAsync<Exception>(() =>
            handler.Handle(new CancelActivity.Command { Id = activity.Id }, CancellationToken.None));
    }
}
