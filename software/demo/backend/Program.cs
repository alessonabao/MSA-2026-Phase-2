using backend.Activities.Queries;
using backend.Core;
using backend.data;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(opt =>
{
    var userPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(userPolicy));
});
builder.Services.AddOpenApi();

// Add SQLite DB, refer to appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// register MediatR handler
builder.Services.AddMediatR(medi => medi.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>()); 

// register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// register identity
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();


app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

// create a service scope: when function goes out of scope (run the app using app.Run()), 
// anything used will be disposed by the framework 
using var scope = app.Services.CreateScope();     // create a service scope
var services = scope.ServiceProvider;

// use a try catch block to add the code for seeding the data in db
try
{
          // give access to db context to query to db
          var context = services.GetRequiredService<AppDbContext>();
          var userManager = services.GetRequiredService<UserManager<User>>();

          // creates a database when there's no db or apply pending migrations
          await context.Database.MigrateAsync();

          // seed data in db
          await DbSeedData.SeedData(context, userManager);
}
catch(Exception ex)
{
          // retrieve a logging service from the dependency injection container to log errors 
          // or init steps to make sure app fails immediately if logging is misconfigured
          var logger = services.GetRequiredService<ILogger<Program>>();
          // log any exception
          logger.LogError(ex, "backend[Program.cs]: An error occurred during migration or seeding.");
}

app.Run();
