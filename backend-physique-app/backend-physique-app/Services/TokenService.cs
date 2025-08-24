using backend_physique_app.Data;
using backend_physique_app.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using backend_physique_app.Services.Interfaces;
namespace backend_physique_app.Services.Auth;



public class TokenService : ITokenService
{
    private readonly UserDbContext _dbContext;
    private readonly ILogger<TokenService> _logger;
    private readonly TimeSpan _tokenExpiration = TimeSpan.FromHours(24);

    public TokenService(UserDbContext dbContext, ILogger<TokenService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<string> GeneratePasswordResetTokenAsync(Guid userId)
    {
        // Vérifier si l'utilisateur existe
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("Utilisateur introuvable");
        }

        // Supprimer les anciens tokens pour cet utilisateur
        var oldTokens = await _dbContext.PasswordResetTokens
            .Where(t => t.UserId == userId)
            .ToListAsync();

        if (oldTokens.Any())
        {
            _dbContext.PasswordResetTokens.RemoveRange(oldTokens);
        }

        // Générer un token unique
        string token = GenerateRandomToken();

        // Créer et sauvegarder le token en base de données
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

        return token;
    }

    public async Task<(bool IsValid, Guid UserId)> ValidatePasswordResetTokenAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return (false, Guid.Empty);
        }

        var resetToken = await _dbContext.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == token);

        if (resetToken == null)
        {
            return (false, Guid.Empty);
        }

        // Vérifier si le token est expiré
        if (resetToken.ExpiresAt < DateTime.UtcNow)
        {
            _dbContext.PasswordResetTokens.Remove(resetToken);
            await _dbContext.SaveChangesAsync();
            return (false, Guid.Empty);
        }

        return (true, resetToken.UserId);
    }

    private string GenerateRandomToken()
    {
        var randomBytes = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }
}