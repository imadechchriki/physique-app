using backend_physique_app.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using backend_physique_app.Entities;
using backend_physique_app.Data;
using Microsoft.EntityFrameworkCore;
using backend_physique_app.Services.Interfaces;

namespace backend_physique_app.Controllers;

[ApiController]
[Route("api/auth")]
public class PasswordResetController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly UserDbContext _dbContext;
    private readonly ILogger<PasswordResetController> _logger;

    public PasswordResetController(
        ITokenService tokenService,
        UserDbContext dbContext,
        ILogger<PasswordResetController> logger)
    {
        _tokenService = tokenService;
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpGet("validate-reset-token")]
    public async Task<IActionResult> ValidateResetToken([FromQuery] string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return BadRequest(new { message = "Token invalide" });
        }

        var (isValid, userId) = await _tokenService.ValidatePasswordResetTokenAsync(token);

        if (!isValid)
        {
            return BadRequest(new { message = "Token invalide ou expiré" });
        }

        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return BadRequest(new { message = "Utilisateur introuvable" });
        }

        return Ok(new
        {
            valid = true,
            email = user.Email
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (isValid, userId) = await _tokenService.ValidatePasswordResetTokenAsync(request.Token);

        if (!isValid)
        {
            return BadRequest(new { message = "Token invalide ou expiré" });
        }

        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return BadRequest(new { message = "Utilisateur introuvable" });
        }

        // Mettre à jour le mot de passe
        var passwordHasher = new PasswordHasher<User>();
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        // Supprimer le token utilisé
        var usedToken = await _dbContext.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.Token == request.Token);

        if (usedToken != null)
        {
            _dbContext.PasswordResetTokens.Remove(usedToken);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Mot de passe réinitialisé avec succès" });
    }
}

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Le token est obligatoire")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est obligatoire")]
    [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "La confirmation du mot de passe est obligatoire")]
    [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas")]
    public string ConfirmPassword { get; set; } = string.Empty;
}