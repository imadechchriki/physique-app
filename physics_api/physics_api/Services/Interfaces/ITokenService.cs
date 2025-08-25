using System;
using System.Threading.Tasks;

namespace physics_api.Services.Interfaces
{
    public interface ITokenService
    {
        /// <summary>
        /// Generate a password reset token for a user
        /// </summary>
        /// <param name="userId">The user's ID</param>
        /// <returns>The generated token</returns>
        Task<string> GeneratePasswordResetTokenAsync(Guid userId);

        /// <summary>
        /// Validate a password reset token
        /// </summary>
        /// <param name="token">The token to validate</param>
        /// <returns>A tuple indicating if the token is valid and the associated user ID</returns>
        Task<(bool IsValid, Guid UserId)> ValidatePasswordResetTokenAsync(string token);

        /// <summary>
        /// Invalidate a password reset token after use
        /// </summary>
        /// <param name="token">The token to invalidate</param>
        /// <returns>True if the token was successfully invalidated</returns>
        Task<bool> InvalidatePasswordResetTokenAsync(string token);

        /// <summary>
        /// Clean up expired tokens from the database
        /// </summary>
        Task CleanupExpiredTokensAsync();

        /// <summary>
        /// Generate a 6-digit verification code for email verification
        /// </summary>
        /// <returns>A 6-digit code as string</returns>
        string GenerateVerificationCode();
    }
}