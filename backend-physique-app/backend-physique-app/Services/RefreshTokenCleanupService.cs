using backend_physique_app.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace backend_physique_app.Services
{
    public class RefreshTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RefreshTokenCleanupService> _logger;
        private static readonly TimeSpan CleanupInterval = TimeSpan.FromHours(6);

        public RefreshTokenCleanupService(IServiceProvider serviceProvider, ILogger<RefreshTokenCleanupService> logger)
        {
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("🔁 RefreshTokenCleanupService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupExpiredAndRevokedTokensAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ An error occurred during refresh token cleanup.");
                }

                await Task.Delay(CleanupInterval, stoppingToken);
            }

            _logger.LogInformation("⏹ RefreshTokenCleanupService stopped.");
        }

        private async Task CleanupExpiredAndRevokedTokensAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

            var now = DateTime.UtcNow;

            var tokensToDelete = await dbContext.RefreshTokens
                .Where(rt => rt.ExpiresAt < now || rt.RevokedAt != null)
                .ToListAsync(cancellationToken);

            if (tokensToDelete.Count > 0)
            {
                dbContext.RefreshTokens.RemoveRange(tokensToDelete);
                await dbContext.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("✅ Deleted {Count} expired or revoked refresh tokens at {Time}.",
                    tokensToDelete.Count, now);
            }
            else
            {
                _logger.LogInformation("🧼 No expired or revoked refresh tokens found at {Time}.", now);
            }
        }
    }
}
