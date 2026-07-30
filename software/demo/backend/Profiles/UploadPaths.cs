using System;

namespace backend.Profiles;

// Where uploaded files live on disk. Deliberately outside the project's own directory tree in
// production (see registration in Program.cs) - `dotnet watch`'s file watcher scopes to the
// project folder and crashes its Hot Reload workspace sync when a file appears there that it
// doesn't recognize as a project item, which is exactly what a runtime-written upload is.
public class UploadPaths
{
          public required string ProfilePicturesDirectory { get; set; }
}
