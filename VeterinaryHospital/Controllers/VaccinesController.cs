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
        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> All()
        {
            try
            {
                // get user claims
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (member.Group.IsAdminGroup)
                {
                    // Get all vaccines from the cache, if not found, try to get them from the database
                    var data = await GetVaccines();
                    // log data output
                    return Ok(data);
                }
                else
                {
                    return Unauthorized(new { Message = "You are not authorized to view this resource" });
                }
            } catch(Exception e)
            {
                _logger.LogError(e, "An error occurred while fetching the vaccines");
                return StatusCode(500, new { Message = "An error occurred while fetching the vaccines" });
            }
        }
        protected async Task<IActionResult> GetVaccines()
        {
            var vaccines = await _cache.GetOrCreateAsync("vaccines", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                return await _context.Vaccines.ToListAsync();
            });
            if (vaccines == null)
            {
                return NotFound(new { Message = "No vaccines found" });
            }
            else
            {
                return Ok(vaccines);
            }
        }
        [HttpPost("edit")]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] VaccineForm vaccine)
        {
            try
            {
                // get user claims
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (member.Group.IsAdminGroup && member.Group.CanEdit)
                {
                    if (vaccine.VaccineId == null || vaccine.Name == null)
                    {
                        return BadRequest(new { Message = "VaccineId and Name are required" });
                    }
                    var existingVaccine = await _context.Vaccines.FindAsync(vaccine.VaccineId);
                    if (existingVaccine == null)
                    {
                        return NotFound(new { Message = "Vaccine not found" });
                    }
                    existingVaccine.Name = vaccine.Name;
                    await _context.SaveChangesAsync();
                    // Update the cache for vaccines
                    var vaccines = new List<Vaccine>();
                    _cache.TryGetValue("vaccines", out vaccines);
                    if(vaccines != null)
                    {
                        var existingData = vaccines.Where(v => v.VaccineId == vaccine.VaccineId).First();
                        if (existingData != null)
                        {
                            vaccines.Remove(existingData);
                            vaccines.Add(existingVaccine);
                            // save the cache for 30 days
                            _cache.Set("vaccines", vaccines, TimeSpan.FromDays(30));
                        }
                    } else
                    {
                        vaccines.Add(existingVaccine);
                        // save the cache for 30 days
                        _cache.Set("vaccines", vaccines, TimeSpan.FromDays(30));
                    }
                    return Ok(new { Message = "Vaccine updated successfully" });
                }
                else
                {
                    return Unauthorized(new { Message = "You are not authorized to edit this resource" });
                }
            } catch(Exception e)
            {
                _logger.LogError(e, "An error occurred while updating the vaccine");
                return StatusCode(500, new { Message = "An error occurred while updating the vaccine" });
            }
        }
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] VaccineForm vaccine)
        {
            try
            {
                // get user claims
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (member.Group.IsAdminGroup && member.Group.CanAdd)
                {
                    if (vaccine.Name == null)
                    {
                        return BadRequest(new { Message = "Name is required" });
                    }
                    var existingVaccine = await _context.Vaccines.FirstOrDefaultAsync(v => v.Name == vaccine.Name);
                    if (existingVaccine != null)
                    {
                        return BadRequest(new { Message = "Vaccine already exists" });
                    }
                    var newVaccine = new Vaccine
                    {
                        Name = vaccine.Name
                    };
                    _context.Vaccines.Add(newVaccine);
                    await _context.SaveChangesAsync();
                    // Update the cache for vaccines
                    //
                    var vaccines = new List<Vaccine>();
                    if(_cache.Get("vaccines") != null && _cache.TryGetValue("vaccines", out vaccines))
                    {
                        vaccines.Add(newVaccine);
                    } else
                    {
                        vaccines.Add(newVaccine);
                    }
                        _logger.LogWarning($"Vaccine variable {vaccines}");
                    
                    // save the cache for 30 days
                    _cache.Set("vaccines", vaccines, TimeSpan.FromDays(30));
                    _logger.LogWarning($"Vaccine data: {newVaccine}");
                    _logger.LogWarning($"Vaccine data: {newVaccine}");
                    return Ok(new { Message = "Vaccine added successfully", vaccine = newVaccine });
                }
                else
                {
                    _logger.LogWarning("Failed to set vaccine");
                    return Unauthorized(new { Message = "You are not authorized to add this resource" });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while adding the vaccine");
                return StatusCode(500, new { Message = "An error occurred while adding the vaccine" });
            }
        }
        [HttpPost("delete")]
        [Authorize]
        public async Task<IActionResult> Delete([FromBody] VaccineForm vaccine)
        {
            try
            {
                // get user claims
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                var member = await _context.Users.Include("Group").FirstOrDefaultAsync(u => u.Email == user);
                if (user == null || member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (member.Group.IsAdminGroup && member.Group.CanDelete)
                {
                    if (vaccine.VaccineId == null)
                    {
                        return BadRequest(new { Message = "VaccineId is required" });
                    }
                    var existingVaccine = await _context.Vaccines.FindAsync(vaccine.VaccineId);
                    if (existingVaccine == null)
                    {
                        return NotFound(new { Message = "Vaccine not found" });
                    }
                    _context.Vaccines.Remove(existingVaccine);
                    await _context.SaveChangesAsync();
                    // Update the cache for vaccines
                    var vaccines = new List<Vaccine>();
                    _cache.TryGetValue("vaccines", out vaccines);
                    if (vaccines != null)
                    {
                        var existingData = vaccines.Where(v => v.VaccineId == vaccine.VaccineId).First();
                        if (existingData != null)
                        {
                            vaccines.Remove(existingData);
                            // save the cache for 30 days
                            _cache.Set("vaccines", vaccines, TimeSpan.FromDays(30));
                        }
                    }
                    return Ok(new { Message = "Vaccine deleted successfully" });
                }
                else
                {
                    return Unauthorized(new { Message = "You are not authorized to delete this resource" });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while deleting the vaccine");
                return StatusCode(500, new { Message = "An error occurred while deleting the vaccine" });
            }
        }
    }

    public class VaccineForm
    {
        public int? VaccineId { get; set; }
        public string? Name { get; set; }
    }
}
