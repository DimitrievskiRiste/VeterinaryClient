using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Runtime.InteropServices;
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
                var user = await _context.Users.Include(u => u.Group).FirstOrDefaultAsync(u => u.Email == userId);
                if (user == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                if (user.Group == null)
                {
                    return BadRequest(new { Message = "User's group not found" });
                }
                _logger.LogWarning("Form: {form}", form);
                // If is user an admin, he can specify on which user to add pet if not only he can add pet to his account
                Pet pet = new Pet
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
                _logger.LogWarning("Form data {form}", form);
                _logger.LogError(ex, "Error adding pet");
                return StatusCode(500, new { Message = "Error adding pet" });
            }
        }
        [HttpGet("get")]
        [Authorize]
        public async Task<IActionResult> get()
        {
            try
            {
                // extract user id from claims
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                // If is user admin then we will get all pets from cache, if cache is empty then we will get all pets from database and save it to cache
                var user = await _context.Users.Include(x => x.Group).FirstOrDefaultAsync(u => u.Email == userId);
                if (user == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                // get user pets from cache if exists, if not get it from database and save it to cache
                var pets = _cache.Get<List<Pet>>("pets");

                if (pets == null)
                {
                    pets = await _context.Pets.Include("Avatar").Include("User").ToListAsync();
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                if (user.Group.IsAdminGroup)
                {
                    return await ReturnPetData(pets, user);
                }
                else
                {
                    return await ReturnPetData(pets.Where(x => x.UserId == user.Id).ToList(), user);
                }
            } catch (Exception e)
            {
                // log error
                _logger.LogWarning(e,"An error occured");
                return StatusCode(500);
            }

        }
        public async Task<IActionResult> ReturnPetData(List<Pet> pets, User user)
        {
            foreach (var pet in pets)
            {
                var avatar = _cache.Get<Avatar>($"avatar-{pet.AvatarId}");
                if (avatar == null)
                {
                    avatar = _context.Avatars.FirstOrDefault(x => x.Id == pet.AvatarId);
                    _cache.Set($"avatar-{pet.AvatarId}", avatar, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                pet.Avatar = avatar;
                if(pet.User == null)
                {
                    pet.User = await _context.Users.FirstAsync(x => x.Id == pet.UserId);

                }
                pet.User = new User {
                    Id = pet.User.Id,
                    Email = pet.User.Email,
                    Group = pet.User.Group,
                    Name = pet.User.Name,
                    Surname = pet.User.Surname,
                    Age = pet.User.Age,
                    Password = null,
                    PasswordHash = null,
                    GroupId = pet.User.GroupId
                };
            }
            return Ok(pets);
        }
        [HttpPost("update")]
        [Authorize]
        public async Task<IActionResult> Update([FromBody] PetForm form)
        {
            try
            {
                var user = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                if (user == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var member = await _context.Users.Include(x => x.Group).FirstAsync(u => u.Email == user);
                if (member == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
           
                var pets = new List<Pet>();
                _cache.TryGetValue("pets", out pets);
                if (pets == null)
                {
                    pets = await _context.Pets.Include("Avatar").Include("User").ToListAsync();
                    foreach (var pet in pets)
                    {
                        // if pet user is not in cache get it from database and save it to cache
                        if (pet.User == null)
                        {
                            pet.User = await _context.Users.FirstAsync(x => x.Id == pet.UserId);
                        }
                        if (pet.User.Group == null)
                        {
                            pet.User.Group = await _context.Groups.FirstAsync(x => x.Id == pet.User.GroupId);
                        }
                        // remove password and password hash from pet user object
                        pet.User = new User
                        {
                            Id = pet.User.Id,
                            Email = pet.User.Email,
                            Group = pet.User.Group,
                            Name = pet.User.Name,
                            Surname = pet.User.Surname,
                            Age = pet.User.Age,
                            Password = null,
                            PasswordHash = null,
                            GroupId = pet.User.GroupId,
                        };
                        pets.Add(pet);
                    }
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                }
                // If user performing this action is admin then we will catch first from cache pet if not found get it from database 
                if (member.Group.IsAdminGroup)
                {
                   
                    Pet pet = pets.Find(x => x.Id == form.PetId);
                    if (pet == null)
                    {
                        return NotFound(new { Message = "Pet not found" });
                    }
                    pet.Name = form.Name;
                    pet.Age = form.Age;
                    pet.AvatarId = form.AvatarId;
                    pet.Type = form.Type;
                    pet.UserId = form.UserId;
                    
                    await _context.SaveChangesAsync();
                    // save the cache
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                    return Ok(new { Message = "Pet updated successfully"});
                }
                else
                {
                    Pet pet = pets.Where(x => x.UserId == member.Id).First(x => x.Id == form.PetId);
                    if (pet == null)
                    {
                        return NotFound(new { Message = "Pet not found" });
                    }
                    pet.Name = form.Name;
                    pet.Age = form.Age;
                    pet.AvatarId = form.AvatarId;
                    pet.Type = form.Type;
                    pet.UserId = member.Id;
                    await _context.SaveChangesAsync();
                    // save the cache
                    _cache.Set("pets", pets, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                    });
                    return Ok(new { Message = "Pet updated successfully" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating pet");
                return StatusCode(500, new { Message = "Error updating pet" });
            }
        }
        public class PetForm
        {
            public int PetId { get; set; }
            public string Name { get; set; }
            public int Age { get; set; }
            public string UserId { get; set; }
            public int AvatarId { get; set; }
            public string Type { get; set; }
            public Avatar? Avatar { get; set; }
            public User? User { get; set; }
        }

    }
}
