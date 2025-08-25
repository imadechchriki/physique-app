using physics_api.Services.Interfaces;
using physics_api.Data;
using physics_api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace physics_api.Controllers
{
    /// <summary>
    /// Controller for handling password reset operations
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    [Produces("application/json")]
    public class PasswordResetController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserDbContext _dbContext;
        private readonly ILogger<PasswordResetController> _logger;
        private readonly IConfiguration _configuration;

        // Password validation regex
        private static readonly Regex PasswordRegex = new Regex(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            RegexOptions.Compiled);

        public PasswordResetController(
            ITokenService tokenService,
            UserDbContext dbContext,
            ILogger<PasswordResetController> logger,
            IConfiguration configuration)
        {
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Generates a password reset token for a user
        /// </summary>
        /// <param name="request">Request containing user email</param>
        /// <returns>Confirmation of token generation</returns>
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Forgot password request with invalid model state from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Données invalides",
                        errors = ModelState
                    });
                }

                if (request == null || string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { message = "L'adresse email est obligatoire" });
                }

                // Find user by email
                var user = await _dbContext.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == request.Email.Trim().ToLower());

                // Always return success to prevent email enumeration attacks
                // But only generate token if user exists
                if (user != null)
                {
                    try
                    {
                        var token = await _tokenService.GeneratePasswordResetTokenAsync(user.Id);
                        _logger.LogInformation("Password reset token generated for user {Email}", user.Email);

                        // TODO: Here you would typically send an email with the reset link
                        // Example: await _emailService.SendPasswordResetEmailAsync(user.Email, token);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error generating password reset token for user {Email}", request.Email);
                        // Don't expose the error to prevent information leakage
                    }
                }
                else
                {
                    _logger.LogWarning("Password reset requested for non-existent email: {Email}", request.Email);
                }

                return Ok(new
                {
                    message = "Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation de mot de passe.",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during forgot password request");
                return StatusCode(500, new
                {
                    message = "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Validates a password reset token
        /// </summary>
        /// <param name="token">The token to validate</param>
        /// <returns>Token validation result</returns>
        [HttpGet("validate-reset-token")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<IActionResult> ValidateResetToken([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    _logger.LogWarning("Token validation attempted with null or empty token from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new { message = "Le token est requis" });
                }

                var (isValid, userId) = await _tokenService.ValidatePasswordResetTokenAsync(token);

                if (!isValid || userId == Guid.Empty)
                {
                    _logger.LogWarning("Invalid or expired password reset token validation attempt from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Token invalide ou expiré",
                        timestamp = DateTime.UtcNow
                    });
                }

                var user = await _dbContext.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogError("User not found for valid token during validation. UserId: {UserId}", userId);
                    return BadRequest(new { message = "Token invalide" });
                }

                _logger.LogInformation("Password reset token validated successfully for user {Email}", user.Email);

                return Ok(new
                {
                    valid = true,
                    email = MaskEmail(user.Email ?? ""),
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during token validation");
                return StatusCode(500, new
                {
                    message = "Une erreur est survenue lors de la validation du token",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Resets a user's password using a valid reset token
        /// </summary>
        /// <param name="request">Password reset request</param>
        /// <returns>Reset confirmation</returns>
        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Password reset attempt with invalid model state from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Données invalides",
                        errors = ModelState
                    });
                }

                if (request == null)
                {
                    return BadRequest(new { message = "Les données de réinitialisation sont requises" });
                }

                // Additional password strength validation
                if (!IsPasswordStrong(request.Password))
                {
                    return BadRequest(new
                    {
                        message = "Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)"
                    });
                }

                // Validate and get user
                var (isValid, userId) = await _tokenService.ValidatePasswordResetTokenAsync(request.Token);

                if (!isValid || userId == Guid.Empty)
                {
                    _logger.LogWarning("Password reset attempted with invalid or expired token from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Token invalide ou expiré",
                        timestamp = DateTime.UtcNow
                    });
                }

                var user = await _dbContext.Users.FindAsync(userId);

                if (user == null)
                {
                    _logger.LogError("User not found for valid token during password reset. UserId: {UserId}", userId);
                    return BadRequest(new { message = "Utilisateur introuvable" });
                }

                using var transaction = await _dbContext.Database.BeginTransactionAsync();

                try
                {
                    // Hash the new password
                    var passwordHasher = new PasswordHasher<User>();
                    user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
                    user.UpdatedAt = DateTime.UtcNow;

                    // Invalidate the used token
                    var success = await _tokenService.InvalidatePasswordResetTokenAsync(request.Token);

                    if (!success)
                    {
                        _logger.LogWarning("Failed to invalidate password reset token for user {Email}", user.Email);
                    }

                    // Revoke all existing refresh tokens for security
                    await _dbContext.RefreshTokens
                        .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
                        .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Password successfully reset for user {Email}", user.Email);

                    return Ok(new
                    {
                        message = "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
                        timestamp = DateTime.UtcNow
                    });
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during password reset");
                return StatusCode(500, new
                {
                    message = "Une erreur inattendue est survenue lors de la réinitialisation du mot de passe",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Cleans up expired password reset tokens (admin endpoint)
        /// </summary>
        /// <returns>Cleanup result</returns>
        [HttpPost("cleanup-expired-tokens")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<IActionResult> CleanupExpiredTokens()
        {
            try
            {
                await _tokenService.CleanupExpiredTokensAsync();

                _logger.LogInformation("Manual cleanup of expired password reset tokens completed");

                return Ok(new
                {
                    message = "Nettoyage des tokens expirés effectué avec succès",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during manual token cleanup");
                return StatusCode(500, new
                {
                    message = "Erreur lors du nettoyage des tokens expirés"
                });
            }
        }

        #region Private Methods

        /// <summary>
        /// Validates password strength using regex
        /// </summary>
        private static bool IsPasswordStrong(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return false;

            return PasswordRegex.IsMatch(password);
        }

        /// <summary>
        /// Masks an email address for security purposes
        /// </summary>
        private static string MaskEmail(string email)
        {
            if (string.IsNullOrEmpty(email) || !email.Contains('@'))
                return "***";

            var parts = email.Split('@');
            var localPart = parts[0];
            var domain = parts[1];

            if (localPart.Length <= 2)
                return $"***@{domain}";

            var maskedLocal = $"{localPart[0]}***{localPart[^1]}";
            return $"{maskedLocal}@{domain}";
        }

        #endregion
    }

    #region DTOs

    /// <summary>
    /// Request model for forgot password operation
    /// </summary>
    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "L'adresse email est obligatoire")]
        [EmailAddress(ErrorMessage = "Format d'adresse email invalide")]
        [StringLength(255, ErrorMessage = "L'adresse email ne peut pas dépasser 255 caractères")]
        public string Email { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request model for password reset operation
    /// </summary>
    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "Le token est obligatoire")]
        [StringLength(500, ErrorMessage = "Token invalide")]
        public string Token { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire")]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères")]
        [MaxLength(128, ErrorMessage = "Le mot de passe ne peut pas dépasser 128 caractères")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La confirmation du mot de passe est obligatoire")]
        [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    #endregion
}