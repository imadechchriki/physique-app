namespace physics_api.Entities
{
    public class AdminProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;




    }
}