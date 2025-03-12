using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class User : IdentityUser
    {
     
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public required string Email { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public required int Age { get; set; }
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Valid birth date must be specified!")]
        public DateFormat BirthDate { get; set; }
        [DataType(DataType.Text)]
        [Required(ErrorMessage = "You must specify surname for client/admin")]
        public required string Surname { get; set; }
        public string GetFullName()
        {
            return $"{this.Name} {this.Surname}";
        }
        public List<Pet> Pets { get; set; }
        public required bool isVeterinarian { get; set; }

    }
}
