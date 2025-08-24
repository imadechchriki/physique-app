using backend_physique_app.Models;



namespace backend_physique_app.Services.Interfaces
{
    
    /// <summary>
    /// Interface pour la gestion centralisée des erreurs
    /// </summary>
    public interface IErrorHandler
    {
        /// <summary>
        /// Gère les exceptions pour les opérations synchrones
        /// </summary>
        T HandleOperation<T>(Func<T> operation, string friendlyErrorMessage);

        /// <summary>
        /// Gère les exceptions pour les opérations asynchrones
        /// </summary>
        Task<T> HandleOperationAsync<T>(Func<Task<T>> operation, string friendlyErrorMessage);
    }
}
