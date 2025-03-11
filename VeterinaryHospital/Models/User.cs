using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class User : IdentityUser
    {
     
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Age { get; set; }
        [DataType(DataType.Date)]
        [Required(ErrorMessage = "Valid birth date must be specified!")]
        public DateFormat BirthDate { get; set; }
        [DataType(DataType.Text)]
        [Required(ErrorMessage = "You must specify surname for client/admin")]
        public string Surname { get; set; }
        public string Token { get; set; }
        public string GetFullName()
        {
            return $"{this.Name} {this.Surname}";
        }

    }
}
