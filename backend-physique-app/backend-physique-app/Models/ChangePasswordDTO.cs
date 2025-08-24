// Models/ChangePasswordDTO.cs
namespace backend_physique_app.Models;

public class ChangePasswordDTO
{
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}

