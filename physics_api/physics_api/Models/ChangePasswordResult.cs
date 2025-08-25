// Models/ChangePasswordResult.cs
namespace physics_api.Models;

public class ChangePasswordResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
