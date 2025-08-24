// Controllers/AccountController.cs
using backend_physique_app.Models;
using backend_physique_app.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_physique_app.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController(IAccountService accountService) : ControllerBase
{


    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var result = await accountService.ChangePasswordAsync(userId, dto);
        return result.Success ? Ok(new { result.Message }) : BadRequest(new { result.Message });
    }



}
