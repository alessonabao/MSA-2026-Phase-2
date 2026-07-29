using AutoMapper;
using backend.Core;
using backend.Tests.Testing;

namespace backend.Tests.Core;

/// <summary>
/// Tests for <see cref="MappingProfiles"/>, the AutoMapper profile that maps
/// <see cref="backend.Models.ClubActivity"/> onto itself for the edit-activity flow.
/// </summary>
public class MappingProfilesTests
{
    /// <summary>Verifies that the profile's configuration is internally consistent and AutoMapper can build it.</summary>
    [Fact]
    public void Configuration_IsValid()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. an AutoMapper configuration that registers MappingProfiles).
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfiles>());

        // Act: perform the single operation being tested (e.g. asking AutoMapper to validate every map it knows about).
        // Assert: check the outcome matches what was expected. Act and Assert are combined here because AssertConfigurationIsValid() throws on failure instead of returning a value to inspect (e.g. a missing/mismatched member would throw an AutoMapperConfigurationException).
        configuration.AssertConfigurationIsValid();
    }

    /// <summary>Verifies that mapping one <see cref="backend.Models.ClubActivity"/> onto another copies its field values across.</summary>
    [Fact]
    public void Map_CopiesAllFieldsOntoTarget()
    {
        // Arrange: build the objects the test needs before doing anything (e.g. a real mapper, plus a source and destination activity that share an id but differ in title).
        var mapper = TestMapperFactory.Create();
        var sharedId = Guid.NewGuid().ToString();
        var source = TestClubActivityFactory.Create(id: sharedId, title: "Source Title");
        var destination = TestClubActivityFactory.Create(id: sharedId, title: "Old Title");

        // Act: perform the single operation being tested (e.g. mapping the source activity's fields onto the destination instance).
        mapper.Map(source, destination);

        // Assert: check the outcome matches what was expected (e.g. the destination's title and other fields now match the source).
        Assert.Equal(sharedId, destination.Id);
        Assert.Equal("Source Title", destination.Title);
        Assert.Equal(source.Description, destination.Description);
        Assert.Equal(source.Weapon, destination.Weapon);
    }
}
