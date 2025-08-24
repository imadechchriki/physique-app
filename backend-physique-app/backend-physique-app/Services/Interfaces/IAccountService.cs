using backend_physique_app.Models;

namespace backend_physique_app.Services.Interfaces;

public interface IAccountService
{
    Task<ChangePasswordResult> ChangePasswordAsync(Guid userId, ChangePasswordDTO dto);

}
