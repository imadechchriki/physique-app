using backend_physique_app.Models;
using backend_physique_app.Exceptions; // Ajout de cette directive
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using backend_physique_app.Services.Interfaces;

namespace backend_physique_app.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var response = await _authService.LoginAsync(loginDto);
                if (response == null)
                {
                    return Unauthorized(new { message = "Email ou mot de passe incorrect" });
                }
                return Ok(response);
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "Erreur d'authentification lors de la connexion");
                return StatusCode(500, new { message = "Une erreur est survenue lors de la connexion" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur inattendue lors de la connexion");
                return StatusCode(500, new { message = "Une erreur inattendue est survenue" });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResponseDTO>> RefreshToken(RefreshTokenRequestDTO refreshRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var response = await _authService.RefreshTokensAsync(refreshRequest);
                if (response == null)
                {
                    return Unauthorized(new { message = "Token de rafraîchissement invalide ou expiré" });
                }
                return Ok(response);
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "Erreur lors du rafraîchissement du token");
                return StatusCode(500, new { message = "Une erreur est survenue lors du rafraîchissement du token" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur inattendue lors du rafraîchissement du token");
                return StatusCode(500, new { message = "Une erreur inattendue est survenue" });
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout([FromBody] LogoutRequestDTO request)
        {
            var result = await _authService.LogoutAsync(request);
            if (!result)
                return BadRequest(new { message = "Échec de la déconnexion" });

            return Ok(new { message = "Déconnexion réussie" });
        }


    }
}