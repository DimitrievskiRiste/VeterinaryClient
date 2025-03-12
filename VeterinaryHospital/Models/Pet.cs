namespace VeterinaryHospital.Models
{
    public class Pet
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Age { get; set; }
        public required string UserId { get; set; }
        public int PetId { get; set; }

        public User User { get; set; }
        public List<Vaccine> Vaccines { get; set; }
    }
}
