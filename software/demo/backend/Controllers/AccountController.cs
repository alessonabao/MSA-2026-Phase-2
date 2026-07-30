using System;
using backend.Models;
using backend.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
          [AllowAnonymous]
          [HttpPost("register")]
          public async Task<ActionResult> RegisterUser(RegisterUser registerUser)
          {
                    var user = new User
                    {
                              UserName = registerUser.Email,
                              Email = registerUser.Email,
                              ProfileName = registerUser.ProfileName
                    };

                    var result = await signInManager.UserManager.CreateAsync(user, registerUser.Password);

                    if(result.Succeeded)
                    {
                              // public registration always creates regular club members - ClubAdmin
                              // accounts are provisioned separately (seed data / DB), never self-serve
                              await signInManager.UserManager.AddToRoleAsync(user, Roles.Member);
                              return Ok();
                    }

                    foreach(var error in result.Errors)
                    {
                              ModelState.AddModelError(error.Code, error.Description);
                    }

                    return ValidationProblem();
          }

          [AllowAnonymous]
          [HttpGet("user-info")]
          public async Task<ActionResult> GetUserInfo()
          {
                    if(User.Identity?.IsAuthenticated == false) return NoContent();

                    var user = await signInManager.UserManager.GetUserAsync(User);

                    if(user == null) return Unauthorized();

                    var roles = await signInManager.UserManager.GetRolesAsync(user);

                    return Ok(new
                    {
                              user.ProfileName,
                              user.Email,
                              user.Id,
                              user.ProfileImageUrl,
                              Role = roles.FirstOrDefault() ?? Roles.Member
                    });
          }

          [HttpPost("logout")]
          public async Task<ActionResult> Logout()
          {
                    await signInManager.SignOutAsync();

                    return NoContent();
          }

}
