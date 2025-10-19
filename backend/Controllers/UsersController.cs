using Backend.Data;
using Backend.Models;
using Backend.Dtos;
using Backend.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 20)
    {
        page = page < 1 ? 1 : page;
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Users.AsNoTracking();
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new UserResponse(
                x.Id,
                x.Username,
                x.Name,
                x.Address,
                x.PhoneNumber,
                x.CreatedAt
            ))
            .ToListAsync();
        return Ok(new ApiResponse<IEnumerable<UserResponse>>(items, true, "Users retrieved successfully"));
    }

    [HttpGet("data")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUser()
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var Id)) return Forbid();

        var item = await _db.Users.AsNoTracking()
            .Where(x => x.Id == Id)
            .Select(x => new UserResponse(
                x.Id,
                x.Username,
                x.Name,
                x.Address,
                x.PhoneNumber,
                x.CreatedAt
            ))
            .FirstOrDefaultAsync();
        if (item is null) return NotFound();
        return Ok(new ApiResponse<UserResponse>(item, true, "User retrieved successfully"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateRequest request)
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
        if (id != ownerId) return Forbid();
        
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user is null) return NotFound();

        user.Username = request.Username ?? user.Username;
        user.Name = request.Name ?? user.Name;
        user.Address = request.Address ?? user.Address;
        user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}