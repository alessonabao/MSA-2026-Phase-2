using System;
using backend.Data;
using backend.Models;

namespace backend.data;

public class DbSeedData
{
          public static async Task SeedData(AppDbContext context)
          {
                    // check if there's any events table in the database
                    if(context.ClubActivities.Any()) return;

                    var clubActivities = new List<ClubActivity>
                    {
                              // populate data
                              new()
                              {
                                        Title = "Auckland Foil Open 2026",
                                        Date = new DateTime(2026, 8, 2),
                                        StartTime = new TimeOnly(9, 0),
                                        EndTime = new TimeOnly(17, 0),
                                        Description = "Annual Auckland Foil Open tournament. All club members welcome to compete in pool rounds and direct elimination.",
                                        Weapon = "Foil",
                                        SkillLevel = "Intermediate",
                                        Type = "Competition",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 25.00
                              },
                              new()
                              {
                                        Title = "Beginner Épée Training Session",
                                        Date = new DateTime(2026, 8, 6),
                                        StartTime = new TimeOnly(18, 0),
                                        EndTime = new TimeOnly(20, 0),
                                        Description = "Introductory Épée training for new members. Focus on footwork fundamentals and basic blade actions. No prior experience needed.",
                                        Weapon = "Épée",
                                        SkillLevel = "Beginner",
                                        Type = "Training",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "Sabre Club Social Night",
                                        Date = new DateTime(2026, 8, 9),
                                        StartTime = new TimeOnly(17, 30),
                                        EndTime = new TimeOnly(20, 30),
                                        Description = "Casual Sabre social fencing night. Friendly bouts, pizza, and good company. A great way to meet other club members.",
                                        Weapon = "Sabre",
                                        SkillLevel = "Beginner",
                                        Type = "Social",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "NZ National Foil Championship — Qualifier",
                                        Date = new DateTime(2026, 8, 15),
                                        StartTime = new TimeOnly(8, 30),
                                        EndTime = new TimeOnly(18, 0),
                                        Description = "North Island qualifier for the NZ National Foil Championship. Top finishers proceed to nationals in Wellington. FIE rules apply.",
                                        Weapon = "Foil",
                                        SkillLevel = "Advanced",
                                        Type = "Competition",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 40.00
                              },
                              new()
                              {
                                        Title = "Épée Intermediate Drilling Workshop",
                                        Date = new DateTime(2026, 8, 20),
                                        StartTime = new TimeOnly(19, 0),
                                        EndTime = new TimeOnly(21, 0),
                                        Description = "Focused drilling session on distance management and second-intention actions in Épée. Bring your own kit.",
                                        Weapon = "Épée",
                                        SkillLevel = "Intermediate",
                                        Type = "Training",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "Sabre Beginner Bootcamp",
                                        Date = new DateTime(2026, 10, 4),
                                        StartTime = new TimeOnly(10, 0),
                                        EndTime = new TimeOnly(13, 0),
                                        Description = "Three-hour crash course in Sabre for complete beginners. Equipment provided. Learn the basic guard, advance, and attack actions.",
                                        Weapon = "Sabre",
                                        SkillLevel = "Beginner",
                                        Type = "Training",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "Advanced Foil Tactics Clinic",
                                        Date = new DateTime(2026, 9, 10),
                                        StartTime = new TimeOnly(18, 30),
                                        EndTime = new TimeOnly(20, 30),
                                        Description = "High-performance clinic covering advance-lunge combinations, parry-riposte timing, and video analysis of bout footage.",
                                        Weapon = "Foil",
                                        SkillLevel = "Advanced",
                                        Type = "Training",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "End of Season Social & Prize Giving",
                                        Date = new DateTime(2026, 9, 19),
                                        StartTime = new TimeOnly(17, 0),
                                        EndTime = new TimeOnly(21, 0),
                                        Description = "Celebrate the end of the fencing season with casual bouts, club awards, and a shared dinner. All weapons welcome. Families invited.",
                                        Weapon = "Foil",
                                        SkillLevel = "Beginner",
                                        Type = "Social",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                              new()
                              {
                                        Title = "Mixed Weapons Social Scrimmage",
                                        Date = new DateTime(2026, 10, 17),
                                        StartTime = new TimeOnly(14, 0),
                                        EndTime = new TimeOnly(17, 0),
                                        Description = "Open scrimmage across all three weapons. Rotate partners every 10 minutes. Great for cross-weapon experience and meeting members from other disciplines.",
                                        Weapon = "Épée",
                                        SkillLevel = "Intermediate",
                                        Type = "Social",
                                        IsCancelled = false,
                                        City = "Auckland",
                                        Venue = "Hiwa Recreation Centre, 17 Symonds Street, Auckland CBD",
                                        Latitude = -36.852634,
                                        Longitude = 174.769104,
                                        Price = 0.00
                              },
                    };

                    // EF is tracking the entity in memory for any changes
                    context.ClubActivities.AddRange(clubActivities);

                    // execute a query against database to add events list aboves
                    await context.SaveChangesAsync();
          }
}
