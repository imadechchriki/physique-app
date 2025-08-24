namespace backend_physique_app.Entities;

public class StudentProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Level { get; set; } = string.Empty;

    public string Lycee { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;



}