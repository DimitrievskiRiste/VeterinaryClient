using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class Vaccine
    {
        [Key]
        public int VaccineId { get; set; }
        [Required]
        [RegularExpression("^[a-z\\sA-Z0-9\\-]+$", ErrorMessage = "Name can only contain letters")]
        public required string Name { get; set; }
        public int PetId { get; set; }
        public List<Pet> Pets { get; set; }
        public Pet Pet { get; set; }
        
        public DateTime DateAdded { get; set; }
    }
}
