// Models/ChangePasswordResult.cs
namespace backend_physique_app.Models;

public class ChangePasswordResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
