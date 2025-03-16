using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class Avatar
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string ImagePath { get; set; }
        [Required]
        public string MimeType { get; set; }
        [Required]
        public long Size { get; set; }
        [Required]
        public string Extension { get; set; }

        public List<User>? Users { get; set; } = new List<User>();
        public List<Pet>? Pets { get; set; } = new List<Pet>();
    }
}
