using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class User : IdentityUser
    {
       
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; } = null;
        public required int Age { get; set; }
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Valid birth date must be specified!")]
        public DateTime BirthDate { get; set; }
        [DataType(DataType.Text)]
        [Required(ErrorMessage = "You must specify surname for client/admin")]
        public required string Surname { get; set; }
        public string GetFullName()
        {
            return $"{this.Name} {this.Surname}";
        }
        public List<Pet>? Pets { get; set; } = new List<Pet>();
        [Required(ErrorMessage = "You must specify a group for the user")]
        public required int GroupId { get; set; }
        public Group Group { get; set; }
        public int ?AvatarId { get; set; }
        public Avatar? Avatar { get; set; }

    }
}
