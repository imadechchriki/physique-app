namespace backend_physique_app.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = false);
    }
}
