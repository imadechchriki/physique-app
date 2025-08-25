// Services/AccountService.cs

using physics_api.Data;
using physics_api.Entities;
using physics_api.Helpers;
using physics_api.Models;
using physics_api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace physics_api.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserDbContext context;

        public AccountService(UserDbContext context)
        {
            this.context = context;
        }

        public async Task<ChangePasswordResult> ChangePasswordAsync(Guid userId, ChangePasswordDTO dto)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = "Utilisateur introuvable."
                };
            }

            if (dto.NewPassword != dto.ConfirmPassword)
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = "Les mots de passe ne correspondent pas."
                };
            }

            if (!PasswordValidator.IsStrongPassword(dto.NewPassword, out var validationError))
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = validationError
                };
            }

            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, dto.NewPassword);
            await context.SaveChangesAsync();

            return new ChangePasswordResult
            {
                Success = true,
                Message = "Mot de passe modifi� avec succ�s."
            };
        }

    }
}
