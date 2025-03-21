using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VeterinaryHospital.Models;

namespace VeterinaryHospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ILogger<LoginController> _logger;
        public LoginController(UserManager<User> manager, SignInManager<User> signInManager, IConfiguration configuration, IPasswordHasher<User> passwordHasher, ILogger<LoginController> logger)
        {
            _userManager = manager;
            _signInManager = signInManager;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }
        [HttpPost]
        public async Task<IActionResult> Index([FromBody] LoginForm model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password) == PasswordVerificationResult.Failed)
                {
                    return Ok(new { isLoggedIn = false, Message = "Invalid email or password" });
                }

                // Generate JWT token
                var tokenHandler = new JwtSecurityTokenHandler();
                var userId = user.Id;
                var email = user.Email;
                if (string.IsNullOrEmpty(user.Id) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.UserName))
                {
                    return Ok( new {isLoggedIN = false, Message = "Invalid user data for token generation" });
                }
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim(JwtRegisteredClaimNames.Name, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Sub, userId), // Subject claim
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID

            }),
                    Issuer = _configuration["JwtSettings:Issuer"],
                    Audience = _configuration["JwtSettings:Audience"],

                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"])), SecurityAlgorithms.HmacSha512Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                var tokenString = tokenHandler.WriteToken(token);
                _logger.LogWarning($"Token data: {tokenString}");
                return Ok(new { Token = tokenString, isLoggedIn = true });
            } catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error while logging in");
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal server error" });
            }
        }
    }
    public class LoginForm()
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
