using System;

namespace backend.Models;

public class ClubActivity
{
          public string Id { get; set; } = Guid.NewGuid().ToString();
          public required string Title { get; set; }
          public DateTime Date { get; set; }
          public TimeOnly StartTime { get; set; }
          public TimeOnly EndTime { get; set; }
          public required string Description { get; set; }

          public required string Weapon { get; set; }
          public required string SkillLevel { get; set;}
          public required string Type { get; set; }
          public bool IsCancelled { get; set; }
          public required string City { get; set; }
          public required string Venue { get; set; }
          public double Latitude { get; set; }
          public double Longitude { get; set; }

          public required double Price { get; set; }
}
