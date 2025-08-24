using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_physique_app.Entities
{
    public class PasswordResetToken
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}