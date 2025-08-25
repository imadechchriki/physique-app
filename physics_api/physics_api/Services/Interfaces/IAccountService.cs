using physics_api.Models;

namespace physics_api.Services.Interfaces;

public interface IAccountService
{
    Task<ChangePasswordResult> ChangePasswordAsync(Guid userId, ChangePasswordDTO dto);

}
