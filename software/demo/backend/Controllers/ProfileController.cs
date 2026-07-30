using System;
using backend.Profiles;
using backend.Profiles.Commands;
using backend.Profiles.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class ProfileController() : BaseApiController
{
          [HttpGet]
          public async Task<ActionResult<ProfileDto>> GetProfile()
          {
                    return await Mediator.Send(new GetProfile.Query { UserId = CurrentUserId });
          }

          [HttpPut]
          public async Task<ActionResult<ProfileDto>> UpdateProfile(UpdateProfileRequest request)
          {
                    return await Mediator.Send(new UpdateProfile.Command
                    {
                              UserId = CurrentUserId,
                              ProfileName = request.ProfileName,
                              ProfileBio = request.ProfileBio,
                              Weapon = request.Weapon,
                              SkillLevel = request.SkillLevel,
                              ContactInfo = request.ContactInfo
                    });
          }

          [HttpPost("picture")]
          public async Task<ActionResult<ProfileDto>> UpdateProfilePicture(IFormFile file)
          {
                    return await Mediator.Send(new UpdateProfilePicture.Command { UserId = CurrentUserId, File = file });
          }
}
