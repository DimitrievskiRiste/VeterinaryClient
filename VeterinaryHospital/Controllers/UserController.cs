using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;



namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;
        public UserController(UserManager<User> userManager, ApplicationDbContext context, ILogger<UserController> logger)
        {
            _userManager = userManager;
            _context = context;
            _logger = logger;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Index()
        {
           
            // extract user id from claims
            var token = JwtRegisteredClaimNames.Name;
            var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
          
            if (userId == null)
            {
                return Unauthorized(new { Message = "User not found" });
            }
            // get user from database with group and avatar relationship
            var user = await _context.Users.Include(u => u.Group).Include(u => u.Avatar).FirstOrDefaultAsync(u => u.Email == userId);
            var userDto = new
            {
                Id = user.Id,
                Name = $"{user.Name} {user.Surname}",
                Email = user.Email,
                Group = new
                {
                    Id = user.Group?.Id,
                    Name = user.Group?.Name,
                    IsAdminGroup = user.Group?.IsAdminGroup ?? false,
                    title = user.Group?.Title
                },
                Avatar = new
                {
                    AvatarUrl = user.Avatar?.ImagePath ?? "/default-avatar.png"
                }
            };
            return Ok(userDto);                                                                               
        }
    }
}
