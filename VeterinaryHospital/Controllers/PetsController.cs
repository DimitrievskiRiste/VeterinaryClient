using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class PetsController : Controller
    {
       private readonly ApplicationDbContext _context;
        private readonly ILogger<PetsController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IMemoryCache _cache;
        public PetsController(ApplicationDbContext context, ILogger<PetsController> logger, UserManager<User> userManager, IMemoryCache cache)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _cache = cache;
        }
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] PetForm form)
        {
            try
            {
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var user = await _context.Users.Include(x => x.Group).FirstOrDefaultAsync(u => u.Email == userId);
                if (user == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                // If is user an admin, he can specify on which user to add pet if not only he can add pet to his account
                    var pet = new Pet
                    {
                        Name = form.Name,
                        Age = form.Age,
                        UserId = user.Group.IsAdminGroup ? form.UserId : user.Id,
                        AvatarId = form.AvatarId,
                        Type = form.Type
                    };
                // save pet to database and add it to the cache pets. Specify cache expiration 30 days
                var result = await _context.AddAsync(pet);
                if (result == null)
                {
                    return Ok(new { Message = "Error adding pet", isSaved = false });
                }
                await _context.SaveChangesAsync();
                var pets = _cache.Get<List<Pet>>("pets");
                if (pets == null)
                {
                    pets = new List<Pet>();
                }
                pets.Add(pet);
                _cache.Set("pets", pets, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                });
                return Ok(new { Message = "Pet added successfully", isSaved = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding pet");
                return StatusCode(500, new { Message = "Error adding pet" });
            }
        }
        [HttpGet("get")]
        [Authorize]
        public async Task<IActionResult> get()
        {
            // extract user id from claims
            var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
            if (userId == null)
            {
                return Unauthorized(new { Message = "User not found" });
            }
            // If is user admin then we will get all pets from cache, if cache is empty then we will get all pets from database and save it to cache
            var user = await _context.Users.Include(x => x.Group).FirstOrDefaultAsync(u => u.Email == userId);
            if(user == null)
            {
                return Unauthorized(new { Message = "User not found" });
            }
            if (user.Group.IsAdminGroup)
            {
                var pets = _cache.Get<List<Pet>>("pets");
                if (pets == null)
                {
                    pets = await _context.Pets.ToListAsync();
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                return Ok(pets);
            }
            else
            {
                // get user pets from cache if exists, if not get it from database and save it to cache
                var pets = _cache.Get<List<Pet>>("pets");
                if (pets == null)
                {
                    pets = await _context.Pets.Where(x => x.UserId == user.Id).ToListAsync();
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                // check in cache if pet is for the current user
                pets = pets.Where(x => x.UserId == user.Id).ToList();
                return Ok(pets);
            }
        }
    }
    public class  PetForm
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string UserId { get; set; }
        public int AvatarId { get; set; }
        public string Type { get; set; }
    }
}
