using System;
using backend.Data;
using backend.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace backend.Profiles.Commands;

public class UpdateProfilePicture
{
          private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
          {
                    "image/jpeg",
                    "image/png",
                    "image/webp"
          };

          private const long MaxFileSizeBytes = 5 * 1024 * 1024;

          public class Command : IRequest<ProfileDto>
          {
                    public required string UserId { get; set; }
                    public required IFormFile File { get; set; }
          }

          public class Handler(AppDbContext context, UserManager<User> userManager, UploadPaths uploadPaths) : IRequestHandler<Command, ProfileDto>
          {
                    public async Task<ProfileDto> Handle(Command request, CancellationToken cancellationToken)
                    {
                              if (request.File.Length == 0)
                              {
                                        throw new ArgumentException("No file was uploaded.");
                              }

                              if (request.File.Length > MaxFileSizeBytes)
                              {
                                        throw new ArgumentException("Image must be 5MB or smaller.");
                              }

                              if (!AllowedContentTypes.Contains(request.File.ContentType))
                              {
                                        throw new ArgumentException("Image must be a JPEG, PNG, or WEBP file.");
                              }

                              var user = await userManager.FindByIdAsync(request.UserId);

                              if (user == null)
                              {
                                        throw new Exception("User not found");
                              }

                              var uploadsDir = uploadPaths.ProfilePicturesDirectory;
                              Directory.CreateDirectory(uploadsDir);

                              // remove the previously uploaded picture (only ones this endpoint saved locally, not external URLs)
                              if (!string.IsNullOrEmpty(user.ProfileImageUrl) && user.ProfileImageUrl.StartsWith("/uploads/profile-pictures/"))
                              {
                                        var oldPath = Path.Combine(uploadsDir, Path.GetFileName(user.ProfileImageUrl));

                                        if (File.Exists(oldPath))
                                        {
                                                  File.Delete(oldPath);
                                        }
                              }

                              var extension = Path.GetExtension(request.File.FileName);
                              var fileName = $"{user.Id}-{Guid.NewGuid():N}{extension}";
                              var filePath = Path.Combine(uploadsDir, fileName);

                              await using (var stream = new FileStream(filePath, FileMode.Create))
                              {
                                        await request.File.CopyToAsync(stream, cancellationToken);
                              }

                              user.ProfileImageUrl = $"/uploads/profile-pictures/{fileName}";
                              await userManager.UpdateAsync(user);

                              if (await userManager.IsInRoleAsync(user, Roles.Member))
                              {
                                        await ProfileMapper.AwardProfileCompleteBadgeIfEligible(context, user);
                              }

                              return await ProfileMapper.ToDto(context, userManager, user);
                    }
          }
}
