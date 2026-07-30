using backend.Models;
using backend.Profiles;
using backend.Profiles.Commands;
using backend.Tests.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace backend.Tests.Profiles;

/// <summary>
/// Tests for <see cref="UpdateProfilePicture.Handler"/>: file validation (size, content-type)
/// and that an accepted upload is written to disk and recorded on the user.
/// </summary>
public class UpdateProfilePictureTests
{
    /// <summary>Builds a fake <see cref="IFormFile"/> reporting the given content-type and length, backed by a real in-memory stream of that many bytes.</summary>
    private static IFormFile CreateFormFile(string contentType, int length, string fileName = "photo.png")
    {
        var stream = new MemoryStream(new byte[length]);
        return new FormFile(stream, 0, length, "file", fileName) { Headers = new HeaderDictionary(), ContentType = contentType };
    }

    [Fact]
    public async Task Handle_RejectsOversizedFile()
    {
        // Arrange: the >5MB length is what matters here - the file's actual content is irrelevant since validation short-circuits before any I/O.
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create();
        var userManager = TestIdentityFactory.MockUserManager();
        var uploadPaths = new UploadPaths { ProfilePicturesDirectory = Path.GetTempPath() };
        var handler = new UpdateProfilePicture.Handler(context, userManager.Object, uploadPaths);
        var file = new FormFile(new MemoryStream([1]), 0, 6 * 1024 * 1024, "file", "big.png")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            handler.Handle(new UpdateProfilePicture.Command { UserId = user.Id, File = file }, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_RejectsDisallowedContentType()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var user = TestUserFactory.Create();
        var userManager = TestIdentityFactory.MockUserManager();
        var uploadPaths = new UploadPaths { ProfilePicturesDirectory = Path.GetTempPath() };
        var handler = new UpdateProfilePicture.Handler(context, userManager.Object, uploadPaths);
        var file = CreateFormFile("application/pdf", 1024, "document.pdf");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            handler.Handle(new UpdateProfilePicture.Command { UserId = user.Id, File = file }, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_SavesFileToDisk_AndUpdatesProfileImageUrl()
    {
        // Arrange: a real, disposable temp directory stands in for the uploads folder.
        var tempRoot = Directory.CreateTempSubdirectory().FullName;
        try
        {
            using var context = TestDbContextFactory.Create();
            var user = TestUserFactory.Create();
            var userManager = TestIdentityFactory.MockUserManager();
            userManager.Setup(x => x.FindByIdAsync(user.Id)).ReturnsAsync(user);
            userManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);
            userManager.Setup(x => x.IsInRoleAsync(user, Roles.Member)).ReturnsAsync(true);
            userManager.Setup(x => x.GetRolesAsync(user)).ReturnsAsync([Roles.Member]);
            var uploadPaths = new UploadPaths { ProfilePicturesDirectory = tempRoot };
            var handler = new UpdateProfilePicture.Handler(context, userManager.Object, uploadPaths);
            var file = CreateFormFile("image/png", 1024);

            // Act
            var dto = await handler.Handle(new UpdateProfilePicture.Command { UserId = user.Id, File = file }, CancellationToken.None);

            // Assert
            Assert.NotNull(user.ProfileImageUrl);
            Assert.StartsWith("/uploads/profile-pictures/", user.ProfileImageUrl);
            Assert.Equal(user.ProfileImageUrl, dto.ProfileImageUrl);
            var savedPath = Path.Combine(tempRoot, Path.GetFileName(user.ProfileImageUrl));
            Assert.True(File.Exists(savedPath));
        }
        finally
        {
            Directory.Delete(tempRoot, recursive: true);
        }
    }
}
