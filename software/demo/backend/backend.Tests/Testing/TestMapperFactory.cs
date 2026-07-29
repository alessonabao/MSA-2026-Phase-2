using AutoMapper;
using backend.Core;

namespace backend.Tests.Testing;

/// <summary>
/// Builds a real (non-mocked) AutoMapper <see cref="IMapper"/> configured with the app's
/// production <see cref="MappingProfiles"/>, so handler tests exercise the same mapping
/// behavior the app uses at runtime instead of a stand-in.
/// </summary>
public static class TestMapperFactory
{
    /// <summary>
    /// Creates an <see cref="IMapper"/> wired up with <see cref="MappingProfiles"/>.
    /// </summary>
    public static IMapper Create()
    {
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfiles>());
        return configuration.CreateMapper();
    }
}
