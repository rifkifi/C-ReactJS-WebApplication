using Backend.Data;
using Backend.Models;
using Backend.Dtos;
using Backend.Auth;                    
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;
[ApiController]
[Route("auth")]
public sealed class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _tokens;

    public AuthController(AppDbContext db, IJwtTokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Username and password are required" });

        var username = dto.Username.Trim();
        var exists = await _db.Users.AnyAsync(u => u.Username == username);
        if (exists) return Conflict(new { error = "Username already exists" });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name,
            Address = dto.Address,
            PhoneNumber = dto.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            Roles = new[] { "user" }
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Created($"/auth/{user.Id}", new { id = user.Id });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
        if (user is null) return Unauthorized();

        var ok = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!ok) return Unauthorized();

        var accessToken = _tokens.Create(user);
        return Ok(new { access_token = accessToken, token_type = "Bearer" });
    }
}