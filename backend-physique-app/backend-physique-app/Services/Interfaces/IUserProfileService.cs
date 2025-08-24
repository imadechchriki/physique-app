using backend_physique_app.Models;
using backend_physique_app.Entities;

namespace backend_physique_app.Services;

public interface IUserProfileService
{
    Task<UserProfile?> GetAsync(Guid userId);
    Task<UserProfile?> CreateAsync(Guid userId, UserProfileCreateDTO dto);
    Task<UserProfile?> UpdateAsync(Guid userId, UserProfileUpdateDTO dto);
    Task<bool> HasProfileAsync(Guid userId);

}
