namespace backend_physique_app.Entities
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty; // Student , Admin
        public string? Description { get; set; }


    }
}