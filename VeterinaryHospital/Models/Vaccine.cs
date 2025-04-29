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
        public List<PetVaccine>? PetVaccines;
    }
}
