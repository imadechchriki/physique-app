using physics_api.Data;
using physics_api.Entities;
using physics_api.Models;
using physics_api.Exceptions;
using physics_api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace physics_api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly IErrorHandler _errorHandler;

        // Constants for roles and claims
        private const string STUDENT_ROLE = "Student";
        private const string ADMIN_ROLE = "Admin";
        private const string LEVEL_CLAIM_TYPE = "level";
        private const string LYCEE_CLAIM_TYPE = "lycee";
        private const string CITY_CLAIM_TYPE = "city";

        public AuthService(
            UserDbContext context,
            IConfiguration configuration,
            ILogger<AuthService> logger,
            IErrorHandler errorHandler)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _errorHandler = errorHandler;
        }

        public async Task<AuthResponseDTO?> LoginAsync(LoginDTO request)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    _logger.LogWarning("Login attempted with null request or empty email/password");
                    return null;
                }

                // Include necessary data for students and admins
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.StudentProfile)
                    .Include(u => u.AdminProfile)
                    .Include(u => u.Profile)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user is null)
                {
                    _logger.LogWarning("Login failed: user with email {Email} not found", request.Email);
                    return null;
                }

                if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                    == PasswordVerificationResult.Failed)
                {
                    _logger.LogWarning("Login failed: invalid password for user {Email}", request.Email);
                    return null;
                }

                _logger.LogInformation("User {Email} logged in successfully", user.Email);
                return await CreateTokenResponse(user);
            },
            "Une erreur s'est produite lors de la connexion");
        }

        public async Task<AuthResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                if (request == null || string.IsNullOrEmpty(request.RefreshToken))
                {
                    _logger.LogWarning("Token refresh attempted with null or empty refresh token");
                    return null;
                }

                var user = await ValidateRefreshTokenAsync(request.RefreshToken);
                if (user is null)
                {
                    _logger.LogWarning("Token refresh failed: invalid or expired refresh token");
                    return null;
                }

                _logger.LogInformation("Refresh token used successfully for user {Email}", user.Email);
                return await CreateTokenResponse(user);
            },
            "Une erreur s'est produite lors du rafraîchissement du token");
        }

        private async Task<AuthResponseDTO> CreateTokenResponse(User user)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                var accessToken = await CreateTokenAsync(user);
                var refreshToken = await GenerateAndSaveRefreshTokenAsync(user);
                int tokenExpiryMinutes = GetConfigValue("AppSettings:TokenExpiryMinutes", 60);

                return new AuthResponseDTO
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    Expiration = DateTime.UtcNow.AddMinutes(tokenExpiryMinutes)
                };
            },
            "Erreur lors de la création des tokens d'authentification");
        }

        private async Task<User?> ValidateRefreshTokenAsync(string refreshToken)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                var token = await _context.RefreshTokens
                    .Include(rt => rt.User)
                    .ThenInclude(u => u.Role)
                    .Include(rt => rt.User.StudentProfile)
                    .Include(rt => rt.User.AdminProfile)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(rt => rt.Token == refreshToken &&
                                             rt.ExpiresAt > DateTime.UtcNow &&
                                             rt.RevokedAt == null);
                return token?.User;
            },
            "Erreur lors de la validation du refresh token");
        }

        private string GenerateRefreshToken()
        {
            return _errorHandler.HandleOperation(() =>
            {
                var randomNumber = new byte[64];
                using var rng = RandomNumberGenerator.Create();
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            },
            "Erreur lors de la génération du refresh token");
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                var refreshToken = GenerateRefreshToken();

                // Revoke all existing refresh tokens for this user
                await _context.RefreshTokens
                    .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
                    .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));

                var newRefreshToken = new RefreshToken
                {
                    Id = Guid.NewGuid(),
                    Token = refreshToken,
                    UserId = user.Id,
                    ExpiresAt = DateTime.UtcNow.AddDays(GetConfigValue("AppSettings:RefreshTokenExpiryDays", 30)),
                    CreatedAt = DateTime.UtcNow
                };

                _context.RefreshTokens.Add(newRefreshToken);
                await _context.SaveChangesAsync();

                return refreshToken;
            },
            "Erreur lors de la génération et sauvegarde du refresh token");
        }

        private async Task<string> CreateTokenAsync(User user)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                var jwtKey = GetRequiredEnvironmentVariable("JWT_TOKEN");
                var issuer = GetEnvironmentVariableOrDefault("JWT_ISSUER", "PhysicsLabAPI");
                var audience = GetEnvironmentVariableOrDefault("JWT_AUDIENCE", "PhysicsLabClient");

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
                    new Claim(ClaimTypes.Role, user.Role?.Name ?? "")
                };

                // Add role-specific claims
                await AddRoleSpecificClaimsAsync(user, claims);

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    notBefore: DateTime.UtcNow,
                    expires: DateTime.UtcNow.AddMinutes(GetConfigValue("AppSettings:TokenExpiryMinutes", 60)),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            },
            "Erreur lors de la création du token JWT");
        }

        /// <summary>
        /// Add role-specific claims for students and admins
        /// </summary>
        private async Task AddRoleSpecificClaimsAsync(User user, List<Claim> claims)
        {
            try
            {
                // Check if user is a student
                if (user.Role?.Name?.Equals(STUDENT_ROLE, StringComparison.OrdinalIgnoreCase) == true)
                {
                    var studentProfile = user.StudentProfile;

                    // If StudentProfile wasn't loaded, fetch it
                    if (studentProfile == null)
                    {
                        studentProfile = await _context.StudentProfiles
                            .AsNoTracking()
                            .FirstOrDefaultAsync(sp => sp.UserId == user.Id);
                    }

                    if (studentProfile != null)
                    {
                        // Add student-specific claims
                        if (!string.IsNullOrEmpty(studentProfile.Level))
                        {
                            claims.Add(new Claim(LEVEL_CLAIM_TYPE, studentProfile.Level));
                        }

                        if (!string.IsNullOrEmpty(studentProfile.Lycee))
                        {
                            claims.Add(new Claim(LYCEE_CLAIM_TYPE, studentProfile.Lycee));
                        }

                        if (!string.IsNullOrEmpty(studentProfile.City))
                        {
                            claims.Add(new Claim(CITY_CLAIM_TYPE, studentProfile.City));
                        }

                        _logger.LogDebug("Added student claims for {Email}: Level={Level}, Lycee={Lycee}, City={City}",
                            user.Email, studentProfile.Level, studentProfile.Lycee, studentProfile.City);
                    }
                    else
                    {
                        _logger.LogWarning("Student {Email} has no profile defined", user.Email);
                    }
                }
                // Check if user is an admin
                else if (user.Role?.Name?.Equals(ADMIN_ROLE, StringComparison.OrdinalIgnoreCase) == true)
                {
                    // Add admin-specific claims if needed
                    claims.Add(new Claim("admin_level", "full"));
                    _logger.LogDebug("Added admin claims for {Email}", user.Email);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding role-specific claims for user {Email}", user.Email);
                // Continue without interrupting token creation
            }
        }

        private int GetConfigValue(string key, int defaultValue)
        {
            return int.TryParse(_configuration[key], out var value) && value > 0 ? value : defaultValue;
        }

        private string GetRequiredEnvironmentVariable(string name)
        {
            var value = Environment.GetEnvironmentVariable(name);
            if (string.IsNullOrEmpty(value))
                throw new InvalidOperationException($"La variable d'environnement {name} n'est pas définie.");
            return value;
        }

        private string GetEnvironmentVariableOrDefault(string name, string defaultValue)
        {
            var value = Environment.GetEnvironmentVariable(name);
            return string.IsNullOrEmpty(value) ? defaultValue : value;
        }

        public async Task<bool> LogoutAsync(LogoutRequestDTO request)
        {
            return await _errorHandler.HandleOperationAsync(async () =>
            {
                if (request == null || string.IsNullOrEmpty(request.RefreshToken))
                {
                    _logger.LogWarning("Logout attempted with null or empty refresh token");
                    return false;
                }

                // Find the refresh token in the database
                var refreshToken = await _context.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken &&
                                             rt.RevokedAt == null);

                if (refreshToken == null)
                {
                    _logger.LogWarning("Logout failed: refresh token not found or already revoked");
                    return false;
                }

                // Revoke the refresh token
                refreshToken.RevokedAt = DateTime.UtcNow;

                // Optional: Revoke all refresh tokens for this user (for enhanced security)
                // Uncomment this section if you want to revoke all user tokens
                /*
                await _context.RefreshTokens
                    .Where(rt => rt.UserId == refreshToken.UserId && rt.RevokedAt == null)
                    .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));
                */

                await _context.SaveChangesAsync();

                _logger.LogInformation("User with ID {UserId} logged out successfully", refreshToken.UserId);
                return true;
            },
            "Une erreur s'est produite lors de la déconnexion");
        }
    }
}