
using System.ComponentModel.DataAnnotations;

namespace backend_physique_app.Models
{
    public class UserProfileCreateDTO
    {
        [Phone]
        public string? PhoneNumber { get; set; }


        public string? ProfilePictureUrl { get; set; }

        [DataType(DataType.Date)]
        public DateTime? BirthDate { get; set; }

        public string? Address { get; set; }

        public string? AdditionalInfos { get; set; }
    }
}
