// Controllers/UserProfileController.cs
using backend_physique_app.Models;
using backend_physique_app.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_physique_app.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProfileController(IUserProfileService _profileService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetMyProfile()
    {
        var profile = await _profileService.GetAsync(UserId);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] UserProfileCreateDTO dto)
    {
        var profile = await _profileService.CreateAsync(UserId, dto);
        if (profile is null) return Conflict(new { message = "Profile already exists." });
        return CreatedAtAction(nameof(GetMyProfile), profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UserProfileUpdateDTO dto)
    {
        var profile = await _profileService.UpdateAsync(UserId, dto);
        if (profile is null) return NotFound(new { message = "Profile not found." });
        return Ok(profile);
    }

    [HttpGet("exists")]
    public async Task<IActionResult> CheckIfProfileExists()
    {
        var hasProfile = await _profileService.HasProfileAsync(UserId);
        return Ok(new { hasProfile });
    }
    
    [HttpGet("has-profile/{userId:guid}")]
    public async Task<IActionResult> HasProfile(Guid userId)
    {
        var exists = await _profileService.HasProfileAsync(userId);
        return Ok(new { hasProfile = exists });
    }

    [HttpPost("upload-picture")]

    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Fichier invalide." });

        var ext = Path.GetExtension(file.FileName);
        var allowedExt = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        if (!allowedExt.Contains(ext.ToLower()))
            return BadRequest(new { message = "Format d’image non autorisé." });

        var fileName = $"{Guid.NewGuid()}{ext}";
        var uploadPath = Path.Combine("wwwroot", "uploads", "profiles");
        Directory.CreateDirectory(uploadPath);

        var filePath = Path.Combine(uploadPath, fileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var imageUrl = $"{baseUrl}/uploads/profiles/{fileName}";

        return Ok(new { url = imageUrl });
    }


}
