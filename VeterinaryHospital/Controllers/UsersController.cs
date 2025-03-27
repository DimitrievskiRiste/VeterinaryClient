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
    public class UsersController : Controller
    {
       private readonly ApplicationDbContext _context;
       private readonly ILogger<UsersController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IMemoryCache _cache;
        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger, UserManager<User> userManager, IMemoryCache cache)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
            _cache = cache;
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
                    // Get all users from the cache, if not found, try to getget them from the database
                    var data = await GetUsers();
                    // log data output
                    _logger.LogInformation("Data: {data}", data);
                    return Ok(data);
                }
                else
                {
                    return Unauthorized(new { Message = "You are not authorized to view this resource" });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while fetching the users");
                return StatusCode(500, new { Message = "An error occurred while fetching the users" });
            }
        }
        public async Task<IActionResult> GetUsers()
        {
            var users = await _cache.GetOrCreateAsync("users", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                var items = new List<User>();
                var users = await _context.Users.Include("Group").ToListAsync();
                foreach(var user in users)
                {
                    user.Password = null;
                    user.PasswordHash = null;
                    items.Add(user);
                }
                return items;
            });
            return Ok(users);
        }
        [HttpPost("edit")]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] User model)
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
                var data = await _context.Users.FirstOrDefaultAsync(u => u.Id == model.Id);
                if (model == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                _context.Users.Update(model);
                List<User> items;
                if (_cache.TryGetValue("users", out items))
                {
                    var existingData = items.Where(u => u.Id == model.Id).First();
                    if (existingData == null)
                    {
                        items.Add(model);
                    } else
                    {
                        items.Remove(existingData);
                        items.Add(model);
                    }
                }
                await _context.SaveChangesAsync();
                // save the updated data to the cache for 30 days
                _cache.Set("users", items, TimeSpan.FromDays(30));
                return Ok(new { Message = "User updated successfully" });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while updating the user");
                return StatusCode(500, new { Message = "An error occurred while updating the user" });
            }
        }
        [HttpPost("delete")]
        [Authorize]
        public async Task<IActionResult> Delete([FromBody] User model)
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
                var data = await _context.Users.FirstOrDefaultAsync(u => u.Id == model.Id);
                if (model == null)
                {
                    return NotFound(new { Message = "User not found" });
                }
                _context.Users.Remove(model);
                List<User> items;
                if (_cache.TryGetValue("users", out items))
                {
                    var existingData = items.Where(u => u.Id == model.Id).First();
                    if (existingData != null)
                    {
                        items.Remove(existingData);
                    }
                }
                await _context.SaveChangesAsync();
                // save the updated data to the cache for 30 days
                _cache.Set("users", items, TimeSpan.FromDays(30));
                return Ok(new { Message = "User deleted successfully" });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An error occurred while deleting the user");
                return StatusCode(500, new { Message = "An error occurred while deleting the user" });
            }
        }
    }
}
