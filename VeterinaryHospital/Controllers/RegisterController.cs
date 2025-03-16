using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/register")]
    [ApiController]
    [AllowAnonymous]
    public class RegisterController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<RegisterController> _logger;
        private readonly IMemoryCache _cache;
        private readonly ApplicationDbContext _context;
        public RegisterController(UserManager<User> userManager, IPasswordHasher<User> passwordHasher, ILogger<RegisterController> logger, IMemoryCache cache, ApplicationDbContext context)
        {
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _logger = logger;
            _cache = cache;
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> Index([FromBody] FormData model)
        {
            try
            {
                _logger.LogWarning("Register method called with model: {@Model}", model);
                var username = await _userManager.FindByNameAsync(model.UserName);
                if(username != null)
                {
                    return Ok(new { hasError = true, Message = "Username already exists!" });
                }

                var acc = await _userManager.FindByEmailAsync(model.Email);
                if (acc != null)
                {
                    return Ok(new { hasError = true, Message = "Account with that email already exists!" });

                }

                if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Surname))
                {
                    return Ok(new { hasError = true, Message = "All fields are required!" });
                }
              
                // get the regular group
                var RegularGroup = _context.Groups.FirstOrDefault(x => !x.IsAdminGroup);
                var user = new User
                {
                    UserName = model.UserName,
                    Name = model.Name,
                    Email = model.Email,
                    Surname = model.Surname,
                    BirthDate = model.BirthDate,
                    Age = model.Age,
                    Password = model.Password,
                    GroupId = RegularGroup.Id,
                    PhoneNumber = model.PhoneNumber
                };
                user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
                var result = await _userManager.CreateAsync(user);
                await _userManager.AddPasswordAsync(user, user.PasswordHash);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine(error.Code + ": " + error.Description);
                    }

                    _logger.LogWarning("Data can't be saved {@Errors}", result.Errors);
                    return Ok(new { hasError = true, Message = "Failed to create user account" });
                }

                return Ok(new { Message = "User registered successfully", isRegistered = true });
            }
            catch (Exception e)
            {
                return Ok(new { Message = e.Message, hasError = true });
            }
        }

    }
    public class FormData
    {
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Surname { get; set; }
        public DateTime BirthDate { get; set; }
        public int Age { get; set; }
        public int GroupId { get; set; }
        public string Password { get; set; }
        public string ?PhoneNumber { get; set; }
    }
}
