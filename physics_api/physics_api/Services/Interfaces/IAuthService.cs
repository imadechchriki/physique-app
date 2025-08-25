using physics_api.Models;
using System.Threading.Tasks;

namespace physics_api.Services.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// Authentifie un utilisateur avec email et mot de passe
        /// </summary>
        /// <param name="request">Informations de connexion</param>
        /// <returns>Réponse d'authentification avec tokens ou null si échec</returns>
        /// <exception cref="AuthenticationException">Lancée en cas d'erreur lors de l'authentification</exception>
        Task<AuthResponseDTO?> LoginAsync(LoginDTO request);

        /// <summary>
        /// Rafraîchit les tokens d'accès en utilisant un refresh token valide
        /// </summary>
        /// <param name="request">Requête contenant le refresh token</param>
        /// <returns>Nouvelle réponse d'authentification avec tokens ou null si échec</returns>
        /// <exception cref="AuthenticationException">Lancée en cas d'erreur lors du rafraîchissement</exception>
        Task<AuthResponseDTO?> RefreshTokensAsync(RefreshTokenRequestDTO request);
        Task<bool> LogoutAsync(LogoutRequestDTO request);
    }
}