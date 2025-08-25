using physics_api.Services.Interfaces;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
namespace physics_api.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
        {
            try
            {
                // Accès aux variables par la section "EmailSettings" si vous les avez configurées ainsi dans appsettings.json
                // Ou directement depuis l'environnement system
                string emailSender = _configuration["EmailSettings:Sender"]
                    ?? Environment.GetEnvironmentVariable("EMAIL_SENDER")
                    ?? throw new InvalidOperationException("EMAIL_SENDER n'est pas configuré dans le fichier .env");

                string emailSenderName = _configuration["EmailSettings:SenderName"]
                    ?? Environment.GetEnvironmentVariable("EMAIL_SENDER_NAME")
                    ?? "";

                var message = new MailMessage
                {
                    From = new MailAddress(emailSender, emailSenderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isHtml
                };
                message.To.Add(to);

                string smtpServer = _configuration["EmailSettings:SmtpServer"]
                    ?? Environment.GetEnvironmentVariable("SMTP_SERVER")
                    ?? throw new InvalidOperationException("SMTP_SERVER n'est pas configuré");

                int port = int.Parse(_configuration["EmailSettings:SmtpPort"]
                    ?? Environment.GetEnvironmentVariable("SMTP_PORT")
                    ?? "587");

                bool enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]
                    ?? Environment.GetEnvironmentVariable("SMTP_ENABLE_SSL")
                    ?? "true");

                // Vérifier que les informations d'authentification sont présentes
                string username = _configuration["EmailSettings:Username"]
                    ?? Environment.GetEnvironmentVariable("SMTP_USERNAME")
                    ?? throw new InvalidOperationException("SMTP_USERNAME n'est pas configuré");

                string password = _configuration["EmailSettings:Password"]
                    ?? Environment.GetEnvironmentVariable("SMTP_PASSWORD")
                    ?? throw new InvalidOperationException("SMTP_PASSWORD n'est pas configuré");

                using var client = new SmtpClient(smtpServer, port)
                {
                    EnableSsl = enableSsl,
                    Credentials = new NetworkCredential(username, password)
                };

                await client.SendMailAsync(message);
                _logger.LogInformation($"Email envoyé à {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Erreur lors de l'envoi de l'email à {to}");
                throw;
            }
        }
    }
}