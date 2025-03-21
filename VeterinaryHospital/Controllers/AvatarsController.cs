using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class AvatarsController : Controller
    {
        private readonly UserManager<User> _user;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AvatarsController> _logger;
        private readonly IMemoryCache _cache;
        public AvatarsController(UserManager<User> member, ApplicationDbContext context, ILogger<AvatarsController> logger, IMemoryCache cache)
        {
            _user = member;
            _context = context;
            _logger = logger;
            _cache = cache;
        }
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] AvatarForm form)
        {
            try
            {
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                if (userId == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var user = _context.Users.FirstOrDefault(u => u.Email == userId);
                if (user == null)
                {
                    return Unauthorized(new { Message = "User not found" });
                }
                var avatar = new Avatar
                {
                    Name = form.Name,
                    ImagePath = form.ImagePath,
                    MimeType = form.MimeType,
                    Size = form.Size,
                    Extension = form.Extension,
                };
                // save avatar to database and add it to the cache avatars. Specify cache expiration 30 days
                var result = await _context.AddAsync(avatar);
                if(result == null)
                {
                    return Ok(new { Message = "Error adding avatar", isSaved = false });
                }
                await _context.SaveChangesAsync();
                var avatars = _cache.Get<List<Avatar>>("avatars");
                if (avatars == null)
                {
                    avatars = new List<Avatar>();
                }
                avatars.Add(avatar);
                _cache.Set("avatars", avatars, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
                });
                return Ok(new { Message = "Avatar added successfully", isSaved = true, model = avatar});
            } catch (Exception ex){
                _logger.LogError(ex, "Error adding avatar");
                return StatusCode(500, new { Message = "Error adding avatar" });
            }
        }
    }
    public class AvatarForm
    {
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string MimeType { get; set; }
        public long Size { get; set; }
        public string Extension { get; set; }
        public string UserId { get; set; }
    }
}
