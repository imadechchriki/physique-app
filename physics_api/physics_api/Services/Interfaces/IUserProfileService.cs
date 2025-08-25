using physics_api.Models;
using physics_api.Entities;

namespace physics_api.Services;

public interface IUserProfileService
{
    Task<UserProfile?> GetAsync(Guid userId);
    Task<UserProfile?> CreateAsync(Guid userId, UserProfileCreateDTO dto);
    Task<UserProfile?> UpdateAsync(Guid userId, UserProfileUpdateDTO dto);
    Task<bool> HasProfileAsync(Guid userId);

}
