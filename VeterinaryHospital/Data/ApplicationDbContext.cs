using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User>Users { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Vaccine>Vaccines { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Pets)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Pet>()
                .HasMany(p => p.Vaccines)
                .WithOne(v => v.Pet)
                .HasForeignKey(v => v.PetId);
        }
    }
}
