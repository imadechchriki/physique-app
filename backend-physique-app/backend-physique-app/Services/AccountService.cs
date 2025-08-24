// Services/AccountService.cs

using backend_physique_app.Data;
using backend_physique_app.Entities;
using backend_physique_app.Helpers;
using backend_physique_app.Models;
using backend_physique_app.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend_physique_app.Services
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
