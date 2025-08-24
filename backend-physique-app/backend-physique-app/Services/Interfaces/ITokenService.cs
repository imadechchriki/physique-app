namespace backend_physique_app.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> GeneratePasswordResetTokenAsync(Guid userId);
        Task<(bool IsValid, Guid UserId)> ValidatePasswordResetTokenAsync(string token);
    }
}
