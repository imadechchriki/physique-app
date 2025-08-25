using physics_api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace physics_api.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }
        public DbSet<AdminProfile> AdminProfiles { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Enable UUID extension for PostgreSQL
            modelBuilder.HasPostgresExtension("uuid-ossp");

            // User Entity Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");

                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Role relationship
                entity.HasOne(u => u.Role)
                      .WithMany()
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);

                // RefreshTokens relationship
                entity.HasMany(u => u.RefreshTokens)
                      .WithOne(rt => rt.User)
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // UserProfile relationship
                entity.HasOne(u => u.Profile)
                      .WithOne(p => p.User)
                      .HasForeignKey<UserProfile>(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // StudentProfile relationship
                entity.HasOne(u => u.StudentProfile)
                      .WithOne(sp => sp.User)
                      .HasForeignKey<StudentProfile>(sp => sp.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // AdminProfile relationship (Note: Fixed property name)
                entity.HasOne(u => u.AdminProfile)
                      .WithOne(ap => ap.User)
                      .HasForeignKey<AdminProfile>(ap => ap.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Role Entity Configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Description).HasMaxLength(255);
            });

            // RefreshToken Entity Configuration
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");
                entity.Property(e => e.Token).IsRequired();
                entity.HasIndex(e => e.Token).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // UserProfile Entity Configuration
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");
                entity.HasIndex(p => p.UserId).IsUnique();
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.AdditionalInfos).HasColumnType("jsonb"); // PostgreSQL JSON column
            });

            // StudentProfile Entity Configuration
            modelBuilder.Entity<StudentProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");
                entity.HasIndex(p => p.UserId).IsUnique();

                // Based on your sign-up form fields
                entity.Property(p => p.Level).IsRequired().HasMaxLength(50); // Tronc Commun, 1ère BAC, 2ème BAC
                entity.Property(p => p.Lycee).IsRequired().HasMaxLength(255); // Nom du lycée
                entity.Property(p => p.City).IsRequired().HasMaxLength(100); // Ville
            });

            // AdminProfile Entity Configuration
            modelBuilder.Entity<AdminProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");
                entity.HasIndex(p => p.UserId).IsUnique();
            });

            // PasswordResetToken Entity Configuration
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnType("uuid").HasDefaultValueSql("uuid_generate_v4()");

                entity.Property(e => e.Token).IsRequired();
                entity.HasIndex(e => e.Token).IsUnique();

                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.ExpiresAt).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        // Seed method for initial data
        public static async Task SeedAsync(UserDbContext context)
        {
            // Seed Roles
            if (!await context.Roles.AnyAsync())
            {
                var roles = new[]
                {
                    new Role
                    {
                        Id = Guid.NewGuid(),
                        Name = "Admin",
                        Description = "Administrator with full access"
                    },
                    new Role
                    {
                        Id = Guid.NewGuid(),
                        Name = "Student",
                        Description = "Student user with limited access"
                    }
                };

                await context.Roles.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }

            // Seed Admin User - Zakaryae Chriki
            if (!await context.Users.AnyAsync(u => u.Email == "zakaryae.chriki@admin.physicslab.ma"))
            {
                var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");

                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Zakaryae",
                    LastName = "Chriki",
                    Email = "zakaryae.chriki@admin.physicslab.ma",
                    CreatedAt = DateTime.UtcNow,
                    RoleId = adminRole.Id
                };

                // Hash the password
                var passwordHasher = new PasswordHasher<User>();
                adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin@PhysicsLab2024");

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();

                // Create Admin Profile
                var adminProfile = new AdminProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = adminUser.Id
                };

                context.AdminProfiles.Add(adminProfile);

                // Create User Profile
                var userProfile = new UserProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = adminUser.Id,
                    PhoneNumber = "+212600000000", // Default phone
                    Address = "Casablanca, Morocco"
                };

                context.UserProfiles.Add(userProfile);
                await context.SaveChangesAsync();
            }
        }
    }
}