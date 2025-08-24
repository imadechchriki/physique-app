using System;
using System.ComponentModel.DataAnnotations;

namespace backend_physique_app.Models
{
    public class UserProfileUpdateDTO
    {
        public string? PhoneNumber { get; set; }


        public string? ProfilePictureUrl { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Address { get; set; }

        public string? AdditionalInfos { get; set; }
    }
}
