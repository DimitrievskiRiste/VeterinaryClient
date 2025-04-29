using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualBasic;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class PetVaccinesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<PetVaccinesController> _logger;
        private readonly string _cacheKey = "PetVaccines";
        public PetVaccinesController(ApplicationDbContext context, IMemoryCache cache, ILogger<PetVaccinesController> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }
        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetPetVaccines(int petid)
        {
            try
            {
                // get user claim from email address
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
              
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var member = await _context.Users.Include(u => u.Group).Include(u => u.Avatar).FirstOrDefaultAsync(u => u.Email == userId);
                if (member == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                if (petid == null)
                {
                    return NotFound(new { Message = "Pet not found" });
                }
                int id = Convert.ToInt16(petid);
                var vaccines = GetVaccines();
                var petVaccines = new List<PetVaccine>();
                foreach (var vaccine in vaccines)
                {
                    if (vaccine.PetId == id)
                    {
                    
                        if (member.Group.IsAdminGroup)
                        {
                            petVaccines.Add(vaccine);
                        }
                        else
                        {
                           
                            if (vaccine.Pet.User.Id == member.Id)
                            {
                                petVaccines.Add(vaccine);
                            }
                            else
                            {
                                return Unauthorized(new { Message = "User not found" });
                            }
                        }
                    }
                }
               
                return Ok(petVaccines);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pet vaccines.");
                return StatusCode(500, new { Message = "Internal server error" });
            }
        }

        protected List<PetVaccine> GetVaccines()
        {
            try
            {
                var vaccines = new List<PetVaccine>();
                _cache.TryGetValue(_cacheKey, out vaccines);
                if (vaccines == null)
                {
                    vaccines =  _context.PetVaccines.Include("Pet").Include("Vaccine").ToList();
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromDays(30));
                    _cache.Set(_cacheKey, vaccines, cacheEntryOptions);
                }
                return vaccines;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving vaccines from cache or database.");
                return new List<PetVaccine>();
            }
        }
        private List<Pet> GetPets()
        {
            try
            {
                List<Pet> pets;
                _cache.TryGetValue("pets", out pets);
                if (pets == null)
                {
                    pets = _context.Pets.Include(p => p.User).Include(p => p.Avatar).ToList();
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromDays(30));
                    _cache.Set("pets", pets, cacheEntryOptions);
                }
                return pets;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pets from cache or database.");
                return new List<Pet>();
            }
        }
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddPetVaccine([FromBody] PetVaccine petVaccine)
        {
            try
            {
                if (petVaccine == null)
                {
                    return BadRequest(new { Message = "Invalid pet vaccine data" });
                }
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var user = await _context.Users.Include("Group").Where(p => p.Email == userId).FirstAsync();
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }
                if (!user.Group.IsAdminGroup)
                {
                    return Unauthorized(new { message = "User is not authorized" });
                }
                if (petVaccine.PetId == null || petVaccine.VaccineId == null)
                {
                    return BadRequest(new { Message = "Missing Pet ID or Vaccine ID" });
                }
                var petid = Convert.ToInt16(petVaccine.PetId);
                var vaccine = Convert.ToInt16(petVaccine.VaccineId);
                if (!await _context.Pets.Where(p => p.Id == petid).AnyAsync())
                {
         
                    return BadRequest(new { Message = "Invalid Pet" });
                }
                if (!await _context.Vaccines.Where(v => v.VaccineId == vaccine).AnyAsync())
                {
                    return BadRequest(new { Message = "Vaccine does not exist" });
                }
                DateTime date = Convert.ToDateTime(petVaccine.DateAdded);
                Pet pet = await _context.Pets.Where(p => p.Id == petid).Include("User").FirstAsync();
                Vaccine v = await _context.Vaccines.Where(u => u.VaccineId == vaccine).FirstAsync();
                
                PetVaccine newPetVaccine = new PetVaccine
                {
                    PetId = petid,
                    VaccineId = vaccine,
                    DateAdded = date,
                    Pet = pet,
                    Vaccine = v
                };
                _context.PetVaccines.Add(newPetVaccine);
                await _context.SaveChangesAsync();
                var vaccines = GetVaccines();
                vaccines.Add(newPetVaccine);
              
                //_cache.Set(_cacheKey, vaccines, TimeSpan.FromDays(30));
                return Ok(new {Message = "Successfully added pet vaccine", pet = newPetVaccine});
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error adding pet vaccine.");
                return StatusCode(500, new { Message = "Internal server error" });
            }
        }
    }
    public class PetVaccineForm
    {
        public int PetId { get; set; }
        public int VaccineId { get; set; }
    }
}
