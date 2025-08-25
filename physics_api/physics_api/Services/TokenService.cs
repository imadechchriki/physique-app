using physics_api.Data;
using physics_api.Entities;
using physics_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace physics_api.Services
{
    public class TokenService : ITokenService
    {
        private readonly UserDbContext _dbContext;
        private readonly ILogger<TokenService> _logger;
        private readonly IConfiguration _configuration;
        private readonly TimeSpan _tokenExpiration;

        public TokenService(
            UserDbContext dbContext,
            ILogger<TokenService> logger,
            IConfiguration configuration)
        {
            _dbContext = dbContext;
            _logger = logger;
            _configuration = configuration;

            // Get token expiration from configuration or use default
            var expirationHours = configuration.GetValue<int>("AppSettings:PasswordResetTokenExpiryHours", 24);
            _tokenExpiration = TimeSpan.FromHours(expirationHours);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(Guid userId)
        {
            try
            {
                // Verify user exists
                var user = await _dbContext.Users.FindAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("Attempted to generate password reset token for non-existent user: {UserId}", userId);
                    throw new ArgumentException("Utilisateur introuvable");
                }

                // Remove old tokens for this user
                var oldTokens = await _dbContext.PasswordResetTokens
                    .Where(t => t.UserId == userId)
                    .ToListAsync();

                if (oldTokens.Any())
                {
                    _dbContext.PasswordResetTokens.RemoveRange(oldTokens);
                    _logger.LogInformation("Removed {Count} old password reset tokens for user {UserId}",
                        oldTokens.Count, userId);
                }

                // Generate unique token
                string token = GenerateSecureToken();

                // Create and save token in database
                var passwordResetToken = new PasswordResetToken
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Token = token,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.Add(_tokenExpiration)
                };

                await _dbContext.PasswordResetTokens.AddAsync(passwordResetToken);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Password reset token generated for user {UserId}, expires at {ExpiresAt}",
                    userId, passwordResetToken.ExpiresAt);

                return token;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating password reset token for user {UserId}", userId);
                throw;
            }
        }

        public async Task<(bool IsValid, Guid UserId)> ValidatePasswordResetTokenAsync(string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    _logger.LogWarning("Password reset token validation attempted with null or empty token");
                    return (false, Guid.Empty);
                }

                var resetToken = await _dbContext.PasswordResetTokens
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (resetToken == null)
                {
                    _logger.LogWarning("Password reset token not found: {Token}", token.Substring(0, Math.Min(10, token.Length)));
                    return (false, Guid.Empty);
                }

                // Check if token is expired
                if (resetToken.ExpiresAt < DateTime.UtcNow)
                {
                    _logger.LogWarning("Password reset token expired for user {UserId}, expired at {ExpiresAt}",
                        resetToken.UserId, resetToken.ExpiresAt);

                    // Remove expired token
                    _dbContext.PasswordResetTokens.Remove(resetToken);
                    await _dbContext.SaveChangesAsync();

                    return (false, Guid.Empty);
                }

                _logger.LogInformation("Password reset token validated successfully for user {UserId}", resetToken.UserId);
                return (true, resetToken.UserId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating password reset token");
                return (false, Guid.Empty);
            }
        }

        public async Task<bool> InvalidatePasswordResetTokenAsync(string token)
        {
            try
            {
                var resetToken = await _dbContext.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (resetToken != null)
                {
                    _dbContext.PasswordResetTokens.Remove(resetToken);
                    await _dbContext.SaveChangesAsync();

                    _logger.LogInformation("Password reset token invalidated for user {UserId}", resetToken.UserId);
                    return true;
                }

                _logger.LogWarning("Attempted to invalidate non-existent password reset token");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invalidating password reset token");
                return false;
            }
        }

        public async Task CleanupExpiredTokensAsync()
        {
            try
            {
                var expiredTokens = await _dbContext.PasswordResetTokens
                    .Where(t => t.ExpiresAt < DateTime.UtcNow)
                    .ToListAsync();

                if (expiredTokens.Any())
                {
                    _dbContext.PasswordResetTokens.RemoveRange(expiredTokens);
                    await _dbContext.SaveChangesAsync();

                    _logger.LogInformation("Cleaned up {Count} expired password reset tokens", expiredTokens.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset token cleanup");
            }
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            // Convert to URL-safe base64
            return Convert.ToBase64String(randomBytes)
                .Replace("+", "-")
                .Replace("/", "_")
                .Replace("=", "");
        }

        /// <summary>
        /// Generate a short verification code (6 digits) for email verification
        /// </summary>
        public string GenerateVerificationCode()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var bytes = new byte[4];
                rng.GetBytes(bytes);
                var code = Math.Abs(BitConverter.ToInt32(bytes, 0)) % 1000000;
                return code.ToString("D6");
            }
        }
    }
}