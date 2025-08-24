using backend_physique_app.Models;
using backend_physique_app.Exceptions;
using backend_physique_app.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_physique_app.Controllers
{
    /// <summary>
    /// Controller for handling authentication operations
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Authenticates a user and returns JWT tokens
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>Authentication response with tokens</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(AuthResponseDTO), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Login attempt with invalid model state from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Données de connexion invalides",
                        errors = ModelState
                    });
                }

                // Validate input parameters
                if (loginDto == null)
                {
                    _logger.LogWarning("Login attempt with null loginDto from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new { message = "Les données de connexion sont requises" });
                }

                if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    _logger.LogWarning("Login attempt with empty email or password from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new { message = "L'email et le mot de passe sont obligatoires" });
                }

                // Attempt authentication
                var response = await _authService.LoginAsync(loginDto);

                if (response == null)
                {
                    _logger.LogWarning("Failed login attempt for email: {Email} from IP: {ClientIP}",
                        loginDto.Email, HttpContext.Connection.RemoteIpAddress?.ToString());

                    return Unauthorized(new
                    {
                        message = "Email ou mot de passe incorrect",
                        timestamp = DateTime.UtcNow
                    });
                }

                _logger.LogInformation("Successful login for email: {Email} from IP: {ClientIP}",
                    loginDto.Email, HttpContext.Connection.RemoteIpAddress?.ToString());

                return Ok(response);
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "Authentication error during login for email: {Email}", loginDto?.Email);
                return Unauthorized(new
                {
                    message = "Erreur d'authentification",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument during login for email: {Email}", loginDto?.Email);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for email: {Email}", loginDto?.Email);
                return StatusCode(500, new
                {
                    message = "Une erreur inattendue est survenue. Veuillez réessayer plus tard.",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Refreshes JWT tokens using a valid refresh token
        /// </summary>
        /// <param name="refreshRequest">Refresh token request</param>
        /// <returns>New authentication tokens</returns>
        [HttpPost("refresh-token")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(AuthResponseDTO), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult<AuthResponseDTO>> RefreshToken([FromBody] RefreshTokenRequestDTO refreshRequest)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Token refresh attempt with invalid model state from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Données de rafraîchissement invalides",
                        errors = ModelState
                    });
                }

                // Validate input
                if (refreshRequest == null || string.IsNullOrWhiteSpace(refreshRequest.RefreshToken))
                {
                    _logger.LogWarning("Token refresh attempt with null or empty refresh token from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new { message = "Le token de rafraîchissement est requis" });
                }

                // Attempt token refresh
                var response = await _authService.RefreshTokensAsync(refreshRequest);

                if (response == null)
                {
                    _logger.LogWarning("Failed token refresh attempt from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());

                    return Unauthorized(new
                    {
                        message = "Token de rafraîchissement invalide ou expiré",
                        timestamp = DateTime.UtcNow
                    });
                }

                _logger.LogInformation("Successful token refresh from IP: {ClientIP}",
                    HttpContext.Connection.RemoteIpAddress?.ToString());

                return Ok(response);
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "Authentication error during token refresh");
                return Unauthorized(new
                {
                    message = "Erreur lors du rafraîchissement du token",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument during token refresh");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during token refresh");
                return StatusCode(500, new
                {
                    message = "Une erreur inattendue est survenue lors du rafraîchissement du token",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Logs out a user by revoking their refresh token
        /// </summary>
        /// <param name="request">Logout request containing refresh token</param>
        /// <returns>Logout confirmation</returns>
        [HttpPost("logout")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult> Logout([FromBody] LogoutRequestDTO request)
        {
            try
            {
                // Validate input
                if (request == null || string.IsNullOrWhiteSpace(request.RefreshToken))
                {
                    _logger.LogWarning("Logout attempt with null or empty refresh token from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new { message = "Le token de rafraîchissement est requis pour la déconnexion" });
                }

                var result = await _authService.LogoutAsync(request);

                if (!result)
                {
                    _logger.LogWarning("Failed logout attempt from IP: {ClientIP}",
                        HttpContext.Connection.RemoteIpAddress?.ToString());
                    return BadRequest(new
                    {
                        message = "Échec de la déconnexion. Le token pourrait être invalide ou déjà révoqué.",
                        timestamp = DateTime.UtcNow
                    });
                }

                _logger.LogInformation("Successful logout from IP: {ClientIP}",
                    HttpContext.Connection.RemoteIpAddress?.ToString());

                return Ok(new
                {
                    message = "Déconnexion réussie",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during logout");
                return StatusCode(500, new
                {
                    message = "Une erreur inattendue est survenue lors de la déconnexion",
                    timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Gets information about the current authenticated user
        /// </summary>
        /// <returns>User information</returns>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 401)]
        public ActionResult<object> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                var firstName = User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value;
                var lastName = User.FindFirst(System.Security.Claims.ClaimTypes.Surname)?.Value;
                var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                // Get additional claims
                var level = User.FindFirst("level")?.Value;
                var lycee = User.FindFirst("lycee")?.Value;
                var city = User.FindFirst("city")?.Value;

                var userInfo = new
                {
                    userId,
                    email,
                    firstName,
                    lastName,
                    role,
                    level,
                    lycee,
                    city,
                    isAuthenticated = User.Identity?.IsAuthenticated ?? false
                };

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user information");
                return StatusCode(500, new
                {
                    message = "Une erreur est survenue lors de la récupération des informations utilisateur"
                });
            }
        }

        /// <summary>
        /// Validates if the current JWT token is still valid
        /// </summary>
        /// <returns>Token validation result</returns>
        [HttpGet("validate-token")]
        [Authorize]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 401)]
        public ActionResult<object> ValidateToken()
        {
            return Ok(new
            {
                valid = true,
                timestamp = DateTime.UtcNow,
                message = "Token is valid"
            });
        }
    }
}