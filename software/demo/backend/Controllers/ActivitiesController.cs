using System;
using backend.Activities;
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

          [HttpGet("{id}/attendance")]
          public async Task<ActionResult<AttendanceStatusDto>> GetAttendanceStatus(string id)
          {
                    return await Mediator.Send(new GetActivityAttendance.Query { ActivityId = id, UserId = CurrentUserId });
          }

          [Authorize(Roles = Roles.Member)]
          [HttpPost("{id}/join")]
          public async Task<ActionResult<AttendanceStatusDto>> JoinEvent(string id)
          {
                    return await Mediator.Send(new JoinActivity.Command { ActivityId = id, UserId = CurrentUserId });
          }

          [Authorize(Roles = Roles.Member)]
          [HttpPost("{id}/cancel-attendance")]
          public async Task<ActionResult<AttendanceStatusDto>> CancelAttendance(string id)
          {
                    return await Mediator.Send(new CancelAttendance.Command { ActivityId = id, UserId = CurrentUserId });
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
