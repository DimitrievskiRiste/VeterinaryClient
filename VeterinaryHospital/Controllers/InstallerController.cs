using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using VeterinaryHospital.Data;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class InstallerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<InstallerController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        public InstallerController(ApplicationDbContext context, IMemoryCache cache, ILogger<InstallerController> logger, UserManager<User> userManager, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
            _userManager = userManager;
            _passwordHasher = passwordHasher;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            try
            {
                // Check if we have already installed the application by looking for install.lock file insite wwwroot folder
                var lockFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "install.lock");
                if (System.IO.File.Exists(lockFile))
                {
                    return Ok(new { hasError = true, Message = "Application is already installed" });
                }
                else
                {
                    // Check if we have admin user group from field IsAdmin and regular user group if no create them
                    var adminGroup = _context.Groups.FirstOrDefault(g => g.IsAdminGroup);
                    if (adminGroup == null)
                    {
                        adminGroup = new Group
                        {
                            Name = "Admins",
                            Title = "Admin",
                            CanEdit = true,
                            CanDelete = true,
                            CanAdd = true,
                            IsAdminGroup = true,
                            canManageAdmins = true
                        };
                        _context.Groups.Add(adminGroup);
                        await _context.SaveChangesAsync();
                    }
                    // add this group to the cache array item
                    object[] items;

                    var userGroup = _context.Groups.FirstOrDefault(g => !g.IsAdminGroup);
                    if (userGroup == null)
                    {
                        userGroup = new Group
                        {
                            Name = "Users",
                            Title = "User",
                            CanEdit = false,
                            CanDelete = false,
                            CanAdd = false,
                            IsAdminGroup = false,
                            canManageAdmins = false
                        };
                        _context.Groups.Add(userGroup);
                        await _context.SaveChangesAsync();
                    }
                    // add these groups to the cache array items and store them for 1 day
                    items = new object[] { adminGroup, userGroup };
                    _cache.Set("groups", items, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromDays(1)));
                    return Ok(new { isInstalled = false, groupsCreated = true, Message = "Successfully created default groups" });
                }
            } catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error while installing the application");
                return Ok(new { hasError = true, Message = "Failed to install the application" });
            }
        }
        [HttpGet("step1")]
        // return json true if install.lock file exists false if not
        public async Task<IActionResult> Step1()
        {
            var lockFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "install.lock");
            return Ok(new { isInstalled = System.IO.File.Exists(lockFile) });
        }
        [HttpPost("step2")]
        // Create admin user account
        public async Task<IActionResult> Step2([FromBody] FormData model)
        {
            try
            {
                var f = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "install.lock");
                if (System.IO.File.Exists(f))
                {
                    return Ok(new { hasError = true, Message = "Application is already installed" });
                }
                var username = await _userManager.FindByNameAsync(model.UserName);
                if (username != null)
                {
                    return Ok(new { hasError = true, Message = "Username already exists!" });
                }
                var acc = await _userManager.FindByEmailAsync(model.Email);
                if (acc != null)
                {
                    return Ok(new { hasError = true, Message = "Account with that email already exists!" });
                }
                if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Surname) || string.IsNullOrEmpty(model.Password))
                {
                    return Ok(new { hasError = true, Message = "All fields are required!" });
                }
                // get the admin group
                var AdminGroup = _context.Groups.FirstOrDefault(x => x.IsAdminGroup);
                _logger.LogWarning("Admin group: {@AdminGroup}", AdminGroup);
                var user = new User
                {
                    UserName = model.UserName,
                    Name = model.Name,
                    Email = model.Email,
                    Age = model.Age,
                    Surname = model.Surname,
                    BirthDate = model.BirthDate,
                    GroupId = AdminGroup.Id,
                    Password = model.Password
                };
                // password hash for admin user
                user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    _logger.LogWarning("Admin user created successfully: {@User}", user);
                    await _userManager.AddPasswordAsync(user, user.PasswordHash);
                    // append the cache array items with the admin user
                    var items = _cache.Get("users") as object[];
                    if (items != null)
                    {
                        items = items.Append(user).ToArray();
                    }
                    else
                    {
                        items = new object[] { user };
                    }
                    _cache.Set("users", items, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromDays(1)));
                    // create the lock file with current date and time of installation inside wwwroot folder
                    var lockFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "install.lock");
                    System.IO.File.WriteAllText(lockFile, DateTime.Now.ToString());
                    return Ok(new { isInstalled = true, Message = "Admin user account created successfully" });
                }
                else
                {
                    return Ok(new { hasError = true, Message = "Failed to create admin user account" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error while creating admin user account");
                return Ok(new { hasError = true, Message = "Failed to create admin user account" });
            }
        }
    }
  
}
