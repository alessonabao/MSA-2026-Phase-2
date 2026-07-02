using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<ClubActivity> ClubActivities { get; set; }
}