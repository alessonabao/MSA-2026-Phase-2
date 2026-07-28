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

                    if(result.Succeeded) return Ok();
                    
                    foreach(var error in result.Errors)
                    {
                              ModelState.AddModelError(error.Code, error.Description);
                    }

                    return ValidationProblem();
          }
}
