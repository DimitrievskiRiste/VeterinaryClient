using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace VeterinaryHospital.Models
{
    public class PetVaccine
    {
        [Key]
        public int PetVaccineId { get; set; }
       
        public int PetId { get; set; }
        public Pet Pet { get; set; }
       
        public int VaccineId { get; set; }
        public Vaccine? Vaccine { get; set; }
       
        public DateTime DateAdded { get; set; }
    }
}
