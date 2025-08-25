using physics_api.Data;
using physics_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace physics_api.Services
{
    /// <summary>
    /// Background service that periodically cleans up expired and revoked refresh tokens
    /// </summary>
    public class RefreshTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RefreshTokenCleanupService> _logger;
        private readonly IConfiguration _configuration;
        private readonly TimeSpan _cleanupInterval;
        private readonly TimeSpan _initialDelay;

        public RefreshTokenCleanupService(
            IServiceProvider serviceProvider,
            ILogger<RefreshTokenCleanupService> logger,
            IConfiguration configuration)
        {
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            // Get cleanup interval from configuration, default to 6 hours
            var intervalHours = _configuration.GetValue<int>("AppSettings:TokenCleanupIntervalHours", 6);
            _cleanupInterval = TimeSpan.FromHours(Math.Max(1, intervalHours)); // Minimum 1 hour

            // Initial delay before first cleanup (default 5 minutes)
            var delayMinutes = _configuration.GetValue<int>("AppSettings:TokenCleanupInitialDelayMinutes", 5);
            _initialDelay = TimeSpan.FromMinutes(Math.Max(1, delayMinutes)); // Minimum 1 minute
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("🔁 RefreshTokenCleanupService starting with interval: {Interval}", _cleanupInterval);

            // Wait for initial delay to allow the application to fully start
            try
            {
                await Task.Delay(_initialDelay, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("⏹ RefreshTokenCleanupService cancelled during initial delay");
                return;
            }

            _logger.LogInformation("🚀 RefreshTokenCleanupService started and ready for cleanup operations");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await PerformCleanupOperationsAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("⏹ RefreshTokenCleanupService cleanup cancelled");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ An error occurred during token cleanup operations");

                    // Continue running even if cleanup fails
                    await LogCleanupMetricsAsync();
                }

                // Wait for next cleanup cycle
                try
                {
                    await Task.Delay(_cleanupInterval, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("⏹ RefreshTokenCleanupService cancelled during delay");
                    break;
                }
            }

            _logger.LogInformation("⏹ RefreshTokenCleanupService stopped");
        }

        /// <summary>
        /// Performs all cleanup operations (refresh tokens and password reset tokens)
        /// </summary>
        private async Task PerformCleanupOperationsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
            var tokenService = scope.ServiceProvider.GetService<ITokenService>();

            var startTime = DateTime.UtcNow;
            _logger.LogDebug("🧹 Starting cleanup operations at {StartTime}", startTime);

            // Cleanup refresh tokens
            var refreshTokensDeleted = await CleanupRefreshTokensAsync(dbContext, cancellationToken);

            // Cleanup password reset tokens if TokenService is available
            var passwordResetTokensDeleted = 0;
            if (tokenService != null)
            {
                try
                {
                    await tokenService.CleanupExpiredTokensAsync();
                    passwordResetTokensDeleted = await CountDeletedPasswordResetTokensAsync(dbContext);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Error during password reset token cleanup, continuing with refresh token cleanup");
                }
            }

            var duration = DateTime.UtcNow - startTime;

            if (refreshTokensDeleted > 0 || passwordResetTokensDeleted > 0)
            {
                _logger.LogInformation(
                    "✅ Cleanup completed in {Duration}ms: {RefreshTokens} refresh tokens, {PasswordResetTokens} password reset tokens deleted",
                    duration.TotalMilliseconds,
                    refreshTokensDeleted,
                    passwordResetTokensDeleted);
            }
            else
            {
                _logger.LogDebug("🧼 No expired tokens found during cleanup at {Time}", startTime);
            }
        }

        /// <summary>
        /// Cleans up expired and revoked refresh tokens
        /// </summary>
        private async Task<int> CleanupRefreshTokensAsync(UserDbContext dbContext, CancellationToken cancellationToken)
        {
            try
            {
                var now = DateTime.UtcNow;

                // Get tokens to delete in batches to avoid loading too many into memory
                var batchSize = _configuration.GetValue<int>("AppSettings:TokenCleanupBatchSize", 1000);
                var totalDeleted = 0;

                while (!cancellationToken.IsCancellationRequested)
                {
                    var tokensToDelete = await dbContext.RefreshTokens
                        .Where(rt => rt.ExpiresAt < now || rt.RevokedAt != null)
                        .Take(batchSize)
                        .ToListAsync(cancellationToken);

                    if (tokensToDelete.Count == 0)
                        break;

                    dbContext.RefreshTokens.RemoveRange(tokensToDelete);
                    await dbContext.SaveChangesAsync(cancellationToken);

                    totalDeleted += tokensToDelete.Count;

                    _logger.LogDebug("🗑️ Deleted batch of {Count} refresh tokens", tokensToDelete.Count);

                    // If we got less than the batch size, we're done
                    if (tokensToDelete.Count < batchSize)
                        break;

                    // Small delay between batches to reduce database load
                    await Task.Delay(TimeSpan.FromMilliseconds(100), cancellationToken);
                }

                return totalDeleted;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error during refresh token cleanup");
                throw;
            }
        }

        /// <summary>
        /// Counts deleted password reset tokens (this is an approximation since TokenService handles the actual deletion)
        /// </summary>
        private async Task<int> CountDeletedPasswordResetTokensAsync(UserDbContext dbContext)
        {
            try
            {
                // This is a rough estimate - we count expired tokens that would have been deleted
                var now = DateTime.UtcNow;
                var expiredCount = await dbContext.PasswordResetTokens
                    .CountAsync(t => t.ExpiresAt < now);

                return expiredCount;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Could not count password reset tokens");
                return 0;
            }
        }

        /// <summary>
        /// Logs cleanup metrics for monitoring purposes
        /// </summary>
        private async Task LogCleanupMetricsAsync()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

                var now = DateTime.UtcNow;

                // Count active refresh tokens
                var activeRefreshTokens = await dbContext.RefreshTokens
                    .CountAsync(rt => rt.ExpiresAt > now && rt.RevokedAt == null);

                // Count expired/revoked refresh tokens
                var expiredRefreshTokens = await dbContext.RefreshTokens
                    .CountAsync(rt => rt.ExpiresAt <= now || rt.RevokedAt != null);

                // Count active password reset tokens
                var activePasswordResetTokens = await dbContext.PasswordResetTokens
                    .CountAsync(t => t.ExpiresAt > now);

                // Count expired password reset tokens
                var expiredPasswordResetTokens = await dbContext.PasswordResetTokens
                    .CountAsync(t => t.ExpiresAt <= now);

                _logger.LogInformation(
                    "📊 Token metrics - Active: {ActiveRefresh} refresh, {ActivePasswordReset} password reset | " +
                    "Expired: {ExpiredRefresh} refresh, {ExpiredPasswordReset} password reset",
                    activeRefreshTokens,
                    activePasswordResetTokens,
                    expiredRefreshTokens,
                    expiredPasswordResetTokens);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "⚠️ Could not log cleanup metrics");
            }
        }

        /// <summary>
        /// Handles service shutdown gracefully
        /// </summary>
        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("🛑 RefreshTokenCleanupService is stopping...");

            try
            {
                await base.StopAsync(cancellationToken);
                _logger.LogInformation("✅ RefreshTokenCleanupService stopped gracefully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error during RefreshTokenCleanupService shutdown");
                throw;
            }
        }

        /// <summary>
        /// Performs an immediate cleanup operation (can be called manually)
        /// </summary>
        public async Task PerformImmediateCleanupAsync()
        {
            _logger.LogInformation("🚀 Manual cleanup requested");

            try
            {
                await PerformCleanupOperationsAsync(CancellationToken.None);
                _logger.LogInformation("✅ Manual cleanup completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error during manual cleanup");
                throw;
            }
        }
    }
}