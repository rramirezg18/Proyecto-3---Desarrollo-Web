using AuthService.Data;
using AuthService.Dtos;
using AuthService.Models;
using AuthService.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _db;
        private readonly IConfiguration _cfg;
        private readonly ITokenService _tokens;

        public AuthController(AuthDbContext db, IConfiguration cfg, ITokenService tokens)
        {
            _db = db;
            _cfg = cfg;
            _tokens = tokens;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "El correo ya existe." });

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "User" : dto.Role!.Trim()
            };

            // Genera refresh token inicial
            user.RefreshToken = _tokens.CreateRefreshToken();
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_cfg.GetValue<int>("Jwt:RefreshTokenDays", 7));

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado correctamente." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Credenciales inválidas." });

            // Access + Refresh
            var access = _tokens.CreateAccessToken(
                user,
                _cfg.GetValue<int>("Jwt:AccessTokenMinutes", 60),
                _cfg["Jwt:Issuer"]!,
                _cfg["Jwt:Audience"]!,
                _cfg["Jwt:Key"]!
            );

            // Rotación de refresh
            user.RefreshToken = _tokens.CreateRefreshToken();
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_cfg.GetValue<int>("Jwt:RefreshTokenDays", 7));
            await _db.SaveChangesAsync();

            return Ok(new { token = access, refreshToken = user.RefreshToken, role = user.Role });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u =>
                u.RefreshToken == dto.RefreshToken && u.RefreshTokenExpiresAt > DateTime.UtcNow);

            if (user == null) return Unauthorized(new { message = "Refresh token inválido o expirado." });

            var access = _tokens.CreateAccessToken(
                user,
                _cfg.GetValue<int>("Jwt:AccessTokenMinutes", 60),
                _cfg["Jwt:Issuer"]!,
                _cfg["Jwt:Audience"]!,
                _cfg["Jwt:Key"]!
            );

            user.RefreshToken = _tokens.CreateRefreshToken();
            user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_cfg.GetValue<int>("Jwt:RefreshTokenDays", 7));
            await _db.SaveChangesAsync();

            return Ok(new { token = access, refreshToken = user.RefreshToken });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var email = User.FindFirstValue(ClaimTypes.Email) ??
                        User.FindFirstValue(JwtRegisteredClaimNames.Email);
            if (email == null) return Unauthorized();

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();

            user.RefreshToken = null;
            user.RefreshTokenExpiresAt = null;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Sesión cerrada." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var email = User.FindFirstValue(ClaimTypes.Email)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Email);

            if (email == null) return Unauthorized();

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null) return Unauthorized();

            return Ok(new { user.Id, user.Email, user.Role });
        }

        // Ejemplo de endpoint como Proyecto 2: solo Admin
        [HttpGet("admin/ping")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminPing() => Ok(new { ok = true, role = "Admin" });
    }
}
