using backend_physique_app.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using backend_physique_app.Services.Interfaces;


namespace backend_physique_app.Services
{
    public class ErrorHandler : IErrorHandler
    {
        private readonly ILogger<ErrorHandler> _logger;

        public ErrorHandler(ILogger<ErrorHandler> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gère les exceptions pour les opérations synchrones
        /// </summary>
        public T HandleOperation<T>(Func<T> operation, string friendlyErrorMessage)
        {
            try
            {
                return operation();
            }
            catch (AuthenticationException)
            {
                // Relancer les exceptions d'authentification déjà correctement encapsulées
                throw;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error during operation: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Erreur de base de données", ex);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Invalid operation: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Opération invalide", ex);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "Null argument: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Argument invalide", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error: {Message}", ex.Message);
                throw new AuthenticationException(friendlyErrorMessage, ex);
            }
        }

        /// <summary>
        /// Gère les exceptions pour les opérations asynchrones
        /// </summary>
        public async Task<T> HandleOperationAsync<T>(Func<Task<T>> operation, string friendlyErrorMessage)
        {
            try
            {
                return await operation();
            }
            catch (AuthenticationException)
            {
                // Relancer les exceptions d'authentification déjà correctement encapsulées
                throw;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error during operation: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Erreur de base de données", ex);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Invalid operation: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Opération invalide", ex);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "Null argument: {Message}", ex.Message);
                throw new AuthenticationException($"{friendlyErrorMessage} - Argument invalide", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error: {Message}", ex.Message);
                throw new AuthenticationException(friendlyErrorMessage, ex);
            }
        }
    }
}
