using System.ComponentModel.DataAnnotations;

namespace VeterinaryHospital.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Title { get; set; }
        [Required]
        public required bool CanEdit { get; set; }
        [Required]
        public required bool CanDelete { get; set; }
        [Required]
        public required bool CanAdd { get; set; }
        [Required]
        public required bool IsAdminGroup { get; set;}
        [Required]
        public required bool canManageAdmins { get; set; }
        
        public List<User> ?Users { get; set; }
    }
}
