using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<ClubActivity> ClubActivities { get; set; }
    public required DbSet<UserBadge> UserBadges { get; set; }
    public required DbSet<ActivityAttendance> ActivityAttendances { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserBadge>()
            .HasIndex(b => new { b.UserId, b.Code })
            .IsUnique();

        builder.Entity<ActivityAttendance>()
            .HasIndex(a => new { a.ActivityId, a.UserId })
            .IsUnique();
    }
}