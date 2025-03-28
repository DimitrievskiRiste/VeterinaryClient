using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Caching.Memory;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class VaccinesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<VaccinesController> _logger;
        private readonly IMemoryCache _cache;
        private readonly UserManager<User> _userManager;
        public VaccinesController(ApplicationDbContext context, ILogger<VaccinesController> logger, IMemoryCache cache, UserManager<User> user)
        {
            _context = context;
            _logger = logger;
            _cache = cache;
            _userManager = user;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(int PetId)
        {
            try
            {
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                if (user == null || PetId < 1)
                {
                    return Unauthorized(new { Message = "User or pet not found" });
                }
                var member = await _context.Users.Include("Group").FirstAsync(u => u.Email == user);
                if (member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                List<Vaccine> vaccines;
                List<Pet> pets;
                Pet pet;
                Vaccine vaccine;
                vaccines = _cache.Get<List<Vaccine>>("vaccines");
                pets = _cache.Get<List<Pet>>("pets");
                if (!cacheKeyExists("vaccines"))
                {
                    vaccines = await _context.Vaccines.ToListAsync();
                    _cache.Set("vaccines", vaccines, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }

                if (!cacheKeyExists("pets"))
                {
                    pets = await _context.Pets.ToListAsync();
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                if (vaccines == null || pets == null)
                {
                    return NotFound(new { Message = "Vaccines or pets not found" });
                }

                if (member.Group.IsAdminGroup)
                {
                    return await ExtractVaccine(vaccines, pets, PetId);
                } else
                {
                    if (pets.Where(pets => pets.Id == PetId).First(x => x.UserId == member.Id) != null)
                    {
                        return await ExtractVaccine(vaccines, pets, PetId);
                    }
                    else
                    {
                        return Unauthorized(new { Message = "You are not authorized to view this resource" });
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error getting vaccines");
                return StatusCode(500, new { Message = "Error getting vaccines" });
            }
        }
        private bool cacheKeyExists(string key)
        {
            return _cache.TryGetValue(key, out _);
        }
        private async Task<IActionResult> ExtractVaccine(List<Vaccine> vaccines, List<Pet> pets, int PetId)
        {
            if (vaccines == null || pets == null)
            {
                return NotFound(new { Message = "Vaccines or pets not found" });
            }
            List<Vaccine> extractedVaccines = new List<Vaccine>();
            ExtractedData data = new ExtractedData();
            foreach (var vaccine in vaccines)
            {
                if (vaccine.PetId == PetId)
                {
                    extractedVaccines.Add(vaccine);
                }
            }
            var pet = pets.Find(p => p.Id == PetId);
            if (pet == null)
            {
                return NotFound(new { Message = "Pet not found" });
            }
            data.Pet = pet;
            data.Vaccines = extractedVaccines;
            return Ok(data);
        }
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] Vaccine model)
        {
            try
            {
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (!member.Group.IsAdminGroup)
                {
                    return Unauthorized(new { Message = "You are not authorized to view this resource" });
                }
                if (model == null)
                {
                    return BadRequest(new { Message = "Invalid vaccine data" });
                }
                _context.Vaccines.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Vaccine added" });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error adding vaccine");
                return StatusCode(500, new { Message = "Error adding vaccine" });
            }
        }
        [HttpPost("delete")]
        [Authorize]
        public async Task<IActionResult> Remove([FromBody] Vaccine model)
        {
            try
            {
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (!member.Group.IsAdminGroup)
                {
                    return Unauthorized(new { Message = "You are not authorized to view this resource" });
                }
                if (model == null)
                {
                    return BadRequest(new { Message = "Invalid vaccine data" });
                }
                var vaccine = await _context.Vaccines.FirstOrDefaultAsync(v => v.VaccineId == model.VaccineId);
                if (vaccine == null)
                {
                    return NotFound(new { Message = "Vaccine not found" });
                }
                _context.Vaccines.Remove(vaccine);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Vaccine removed" });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error removing vaccine");
                return StatusCode(500, new { Message = "Error removing vaccine" });
            }
        }
    }
    public class ExtractedData
    {
        public Pet Pet { get; set; }
        public List<Vaccine> Vaccines { get; set; }
    }
}
