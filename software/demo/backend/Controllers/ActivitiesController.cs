using System;
using backend.Activities.Commands;
using backend.Activities.Queries;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class ActivitiesController() : BaseApiController
{
          [HttpGet]
          public async Task<ActionResult<List<ClubActivity>>> GetEvents()
          {
                    return await Mediator.Send(new GetActivityList.Query());
          }

          [HttpGet("{id}")]
          public async Task<ActionResult<ClubActivity>> GetEventDetail(string id)
          {
                    return await Mediator.Send(new GetActivityDetails.Query{Id = id});
          }

          [Authorize(Roles = Roles.ClubAdmin)]
          [HttpPost]
          public async Task<ActionResult<string>> CreateEvent(ClubActivity activity)
          {
                    return await Mediator.Send(new CreateActivity.Command{ClubActivity = activity});
          }

          [Authorize(Roles = Roles.ClubAdmin)]
          [HttpPut]
          public async Task<ActionResult> EditEvent(ClubActivity activity)
          {
                    await Mediator.Send(new EditActivity.Command{ClubActivity = activity});

                    return NoContent();
          }

          [Authorize(Roles = Roles.ClubAdmin)]
          [HttpDelete("{id}")]
          public async Task<ActionResult> DeleteEvent(string id)
          {
                    await Mediator.Send(new DeleteActivity.Command{Id = id});

                    return Ok();
          }
}
