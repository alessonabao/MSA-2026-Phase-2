using backend.data;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add SQLite DB, refer to appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();


app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();

app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();

// create a service scope: when function goes out of scope (run the app using app.Run()), 
// anything used will be disposed by the framework 
using var scope = app.Services.CreateScope();     // create a service scope
var services = scope.ServiceProvider;

// use a try catch block to add the code for seeding the data in db
try
{
          // give access to db context to query to db
          var context = services.GetRequiredService<AppDbContext>();

          // creates a database when there's no db or apply pending migrations
          await context.Database.MigrateAsync();

          // seed data in db
          await DbSeedData.SeedData(context);
}
catch(Exception ex)
{
          // retrieve a logging service from the dependency injection container to log errors 
          // or init steps to make sure app fails immediately if logging is misconfigured
          var logger = services.GetRequiredService<ILogger<Program>>();
          // log any exception
          logger.LogError(ex, "backend[Program.cs]: An error occurred during migration.");
}

app.Run();
