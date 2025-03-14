﻿using Microsoft.AspNetCore.Authorization;
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
        [HttpPost("/")]
        public async Task<IActionResult> Index([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password) == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { isLoggedIn = false, Message = "Invalid email or password" });
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["JwtSettings:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Internal server error" });
            }
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.GetFullName()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString, IsVeteriarian = user.IsVeterinarian });
        }
    }
         
}
