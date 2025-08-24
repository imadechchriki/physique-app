using backend_physique_app.Data;
using backend_physique_app.Entities;
using backend_physique_app.Models;
using backend_physique_app.Exceptions;
using backend_physique_app.Services.Interfaces;
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

namespace backend_physique_app.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly IErrorHandler _errorHandler;

        // Constantes pour les rôles et claims
        private const string STUDENT_ROLE = "Étudiant";
        private const string FILIERE_CLAIM_TYPE = "filiere";

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

                // Inclusion des données nécessaires pour les étudiants
                var user = await _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.StudentProfile) // Inclusion du profil étudiant si nécessaire
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user is null)
                {
                    _logger.LogWarning("Login failed: user with email {Email} not found or inactive", request.Email);
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
                int tokenExpiryMinutes = GetConfigValue("AppSettings:TokenExpiryMinutes", 60); // Changé de 15 à 60 minutes

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
                    .Include(rt => rt.User.StudentProfile) // Inclusion du profil étudiant
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

                await _context.RefreshTokens
                    .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
                    .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));

                var newRefreshToken = new RefreshToken
                {
                    Token = refreshToken,
                    UserId = user.Id,
                    ExpiresAt = DateTime.UtcNow.AddDays(GetConfigValue("AppSettings:RefreshTokenExpiryDays", 30)), // Changé de 7 à 30 jours
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
                var issuer = GetEnvironmentVariableOrDefault("JWT_ISSUER", "DefaultIssuer");
                var audience = GetEnvironmentVariableOrDefault("JWT_AUDIENCE", "DefaultAudience");

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
                    new Claim(ClaimTypes.Role, user.Role?.Name ?? "")
                };

                // Ajout conditionnel de la filière pour les étudiants
                await AddStudentSpecificClaimsAsync(user, claims);

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    notBefore: DateTime.UtcNow,
                    expires: DateTime.UtcNow.AddMinutes(GetConfigValue("AppSettings:TokenExpiryMinutes", 60)), // Changé de 15 à 60 minutes
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            },
            "Erreur lors de la création du token JWT");
        }

        /// <summary>
        /// Ajoute les claims spécifiques aux étudiants (filière, etc.)
        /// </summary>
        /// <param name="user">L'utilisateur pour lequel créer les claims</param>
        /// <param name="claims">La liste des claims à enrichir</param>
        private async Task AddStudentSpecificClaimsAsync(User user, List<Claim> claims)
        {
            try
            {
                // Vérification si l'utilisateur est un étudiant
                if (user.Role?.Name?.Equals(STUDENT_ROLE, StringComparison.OrdinalIgnoreCase) == true)
                {
                    // Récupération de la filière de l'étudiant
                    var studentFiliere = await GetStudentFiliereAsync(user.Id);

                    if (!string.IsNullOrEmpty(studentFiliere))
                    {
                        claims.Add(new Claim(FILIERE_CLAIM_TYPE, studentFiliere));
                        _logger.LogDebug("Added filière claim '{Filiere}' for student {Email}", studentFiliere, user.Email);
                    }
                    else
                    {
                        _logger.LogWarning("Student {Email} has no filière defined", user.Email);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding student-specific claims for user {Email}", user.Email);
                // On continue sans interrompre la création du token
            }
        }

        /// <summary>
        /// Récupère la filière d'un étudiant par son ID utilisateur
        /// </summary>
        /// <param name="userId">L'ID de l'utilisateur</param>
        /// <returns>Le nom de la filière ou null si non trouvée</returns>
        private async Task<string?> GetStudentFiliereAsync(Guid userId)
        {
            try
            {
                // CORRECTION: Puisque Filiere est un string dans StudentProfile
                var studentProfile = await _context.StudentProfiles
                    .AsNoTracking()
                    .Where(sp => sp.UserId == userId)
                    .FirstOrDefaultAsync();

                return studentProfile?.Filiere; // Directement le string, pas .Name

                // Si vous avez une entité Filiere séparée, utilisez cette version à la place :
                /*
                var studentProfile = await _context.StudentProfiles
                    .Include(sp => sp.Filiere)
                    .AsNoTracking()
                    .Where(sp => sp.UserId == userId)
                    .FirstOrDefaultAsync();

                return studentProfile?.Filiere?.Name;
                */

                // Option 2: Si vous avez une relation directe User -> Filiere
                /*
                var user = await _context.Users
                    .Include(u => u.Filiere)
                    .AsNoTracking()
                    .Where(u => u.Id == userId)
                    .FirstOrDefaultAsync();

                return user?.Filiere?.Name;
                */

                // Option 3: Si vous avez une table de liaison User -> Inscription -> Filiere
                /*
                var inscription = await _context.Inscriptions
                    .Include(i => i.Filiere)
                    .AsNoTracking()
                    .Where(i => i.UserId == userId && i.IsActive)
                    .OrderByDescending(i => i.DateInscription)
                    .FirstOrDefaultAsync();

                return inscription?.Filiere?.Name;
                */

                // Option 4: Si la filière est directement dans l'entité User
                /*
                var userWithFiliere = await _context.Users
                    .AsNoTracking()
                    .Where(u => u.Id == userId)
                    .Select(u => u.Filiere)
                    .FirstOrDefaultAsync();

                return userWithFiliere;
                */
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving filière for user {UserId}", userId);
                return null;
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

                // Recherche du refresh token dans la base de données
                var refreshToken = await _context.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken &&
                                             rt.RevokedAt == null);

                if (refreshToken == null)
                {
                    _logger.LogWarning("Logout failed: refresh token not found or already revoked");
                    return false;
                }

                // Révocation du refresh token
                refreshToken.RevokedAt = DateTime.UtcNow;

                // Révocation de tous les autres refresh tokens du même utilisateur (option de sécurité)
                // Décommentez cette section si vous souhaitez révoquer tous les tokens de l'utilisateur
                /*
                await _context.RefreshTokens
                    .Where(rt => rt.UserId == refreshToken.UserId && rt.RevokedAt == null)
                    .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));
                */

                // Enregistrement des modifications
                await _context.SaveChangesAsync();

                _logger.LogInformation("User with ID {UserId} logged out successfully", refreshToken.UserId);
                return true;
            },
            "Une erreur s'est produite lors de la déconnexion");
        }
    }
}