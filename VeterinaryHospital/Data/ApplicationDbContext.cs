using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
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
        public DbSet<Vaccine> Vaccines { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Avatar> Avatars { get; set; }
        public DbSet<PetVaccine> PetVaccines { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationships
            /*
            modelBuilder.Entity<User>()
                .HasMany(u => u.Pets)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);
            */
            modelBuilder.Entity<Pet>()
                .HasMany(p => p.PetVaccines)
                .WithOne(v => v.Pet)
                .HasForeignKey(p => p.PetId)
                .HasPrincipalKey(c => c.Id);
            modelBuilder.Entity<User>()
                .HasOne(u => u.Group)
                .WithMany(g => g.Users)
                .HasForeignKey(u => u.GroupId);
            modelBuilder.Entity<User>()
                .HasOne(u => u.Avatar)
                .WithMany(a => a.Users)
                .HasForeignKey(u => u.AvatarId);
            modelBuilder.Entity<Pet>()
                .HasOne(p => p.Avatar)
                .WithMany(a => a.Pets)
                .HasForeignKey(p => p.AvatarId)
                .OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Pet>()
                .HasOne(p => p.User)
                .WithMany(u => u.Pets)
                .HasForeignKey(p => p.UserId);
            modelBuilder.Entity<PetVaccine>()
                .HasOne(v => v.Vaccine)
                .WithMany(p => p.PetVaccines)
                .HasForeignKey(v => v.VaccineId);
    }
    }
}
