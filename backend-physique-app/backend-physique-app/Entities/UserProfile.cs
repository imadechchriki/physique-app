namespace backend_physique_app.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Address { get; set; }
        public string? AdditionalInfos { get; set; } // Stocker JSON brut
    }
}