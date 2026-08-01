using backend.Activities.Queries;
using backend.Core;
using backend.data;
using backend.Data;
using backend.Models;
using backend.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Scalar.AspNetCore;

// The Web SDK requires wwwroot to physically exist before CreateBuilder runs, even though
// nothing is served from it (uploads live outside the project - see below). Git doesn't track
// empty directories, so a fresh clone wouldn't have it without this. `dotnet run`/`dotnet watch`
// set the working directory to the project folder, so a plain relative path is enough.
Directory.CreateDirectory("wwwroot");

var builder = WebApplication.CreateBuilder(args);

// Uploaded files live one level above the project folder, not under wwwroot - deliberately
// outside the directory tree `dotnet watch` scopes its file watcher to, since a runtime-written
// file appearing inside that tree crashes its Hot Reload workspace sync.
var uploadsRoot = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "uploads"));
var profilePicturesDir = Path.Combine(uploadsRoot, "profile-pictures");
Directory.CreateDirectory(profilePicturesDir);
builder.Services.AddSingleton(new UploadPaths { ProfilePicturesDirectory = profilePicturesDir });

builder.Services.AddControllers(opt =>
{
    var userPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(userPolicy));
});
builder.Services.AddOpenApi();

// Add SQL SERVER DB, refer to appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
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
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();


// Static files must run before UseRouting() - otherwise routing matches "/" (and other
// extensionless paths) to MapFallbackToController before static file middleware gets a
// chance to serve wwwroot/index.html or /uploads directly.
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath = "/uploads"
});
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

// UseAuthorization() must run after UseRouting() (so the endpoint - and its [Authorize]
// metadata - has already been matched) and before the Map* calls that execute it.
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();
app.MapFallbackToController("Index", "Fallback");

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
          var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

          // creates a database when there's no db or apply pending migrations
          await context.Database.MigrateAsync();

          // seed data in db
          await DbSeedData.SeedData(context, userManager, roleManager);
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
