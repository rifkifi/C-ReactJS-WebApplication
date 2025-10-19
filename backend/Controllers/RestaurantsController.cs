using Backend.Data;
using Backend.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class RestaurantsController : ControllerBase
{
    private readonly AppDbContext _db;
    public RestaurantsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<RestaurantResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurants(int page = 1, int pageSize = 20)
    {
        page = page < 1 ? 1 : page;
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Restaurants.AsNoTracking();
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new RestaurantResponse(
                x.Id,
                x.Name,
                x.Address,
                x.RestaurantTypeId,
                x.Type,
                x.Phone,
                x.OpeningHours,
                x.ImageUrl,
                x.Description,
                x.IsActive,
                x.Rating,
                x.RatingCount,
                x.CreatedAt
                ))
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<RestaurantResponse>>(items, true, "Restaurants retrieved successfully"));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<RestaurantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurant(Guid id)
    {
        var item = await _db.Restaurants
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new RestaurantResponse(
                x.Id,
                x.Name,
                x.Address,
                x.RestaurantTypeId,
                x.Type,
                x.Phone,
                x.OpeningHours,
                x.ImageUrl,
                x.Description,
                x.IsActive,
                x.Rating,
                x.RatingCount,
                x.CreatedAt
                ))
            .SingleOrDefaultAsync();

        if (item is null)
            return NotFound();
        return Ok(new ApiResponse<RestaurantResponse>(item, true, "Restaurants retrieved successfully"));
    }

    [HttpGet("owner/{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<RestaurantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantByOwner(Guid id)
    {
        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
        if (id != ownerId) return Forbid();

        var item = await _db.Restaurants
            .AsNoTracking()
            .Where(x => x.OwnerId == id)
            .Select(x => new RestaurantResponse(
                x.Id,
                x.Name,
                x.Address,
                x.RestaurantTypeId,
                x.Type,
                x.Phone,
                x.OpeningHours,
                x.ImageUrl,
                x.Description,
                x.IsActive,
                x.Rating,
                x.RatingCount,
                x.CreatedAt
                ))
            .SingleOrDefaultAsync();
        if (item is null) return NotFound();
        return Ok(new ApiResponse<RestaurantResponse>(item, true, "Restaurants retrieved successfully"));
    }

    [HttpGet("type/{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<RestaurantResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantsByType(Guid id, int page = 1, int pageSize = 20)
    {
        page = page < 1 ? 1 : page;
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Restaurants.AsNoTracking().Where(x => x.RestaurantTypeId == id);
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new RestaurantResponse(
                x.Id,
                x.Name,
                x.Address,
                x.RestaurantTypeId,
                x.Type,
                x.Phone,
                x.OpeningHours,
                x.ImageUrl,
                x.Description,
                x.IsActive,
                x.Rating,
                x.RatingCount,
                x.CreatedAt
                ))
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<RestaurantResponse>>(items, true, "Restaurants retrieved successfully"));
    }

    [HttpPost("create")]
    [Authorize]
    [ProducesResponseType(typeof(RestaurantResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateRestaurant([FromBody] CreateRestaurantRequest req)
    {
        Console.WriteLine(req);
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Address))
            return BadRequest(new { success = false, message = "Name and address are required" });

        var typeExists = await _db.RestaurantTypes.AnyAsync(x => x.Id == req.RestaurantTypeId);
        if (!typeExists) return BadRequest(new { error = "Invalid restaurant type" });

        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var ownerId)) return Forbid();

        var entity = new Restaurant
        {
            Id = Guid.NewGuid(),
            Name = req.Name.Trim(),
            Address = req.Address.Trim(),
            RestaurantTypeId = req.RestaurantTypeId,
            Phone = req.Phone,
            OpeningHours = req.OpeningHours,
            ImageUrl = req.ImageUrl,
            Description = req.Description,
            IsActive = req.IsActive,
            CreatedAt = DateTime.UtcNow,
            OwnerId = ownerId
        };

        _db.Restaurants.Add(entity);
        await _db.SaveChangesAsync();

        var res = new RestaurantResponse(
            entity.Id,
            entity.Name,
            entity.Address,
            entity.RestaurantTypeId,
            entity.Type,
            entity.Phone,
            entity.OpeningHours,
            entity.ImageUrl,
            entity.Description,
            entity.IsActive,
            entity.Rating,
            entity.RatingCount,
            entity.CreatedAt
            );

        return CreatedAtAction(nameof(GetRestaurant), new { id = entity.Id }, new ApiResponse<RestaurantResponse>(res, true, "Restaurant created successfully"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateRestaurant(Guid id, [FromBody] UpdateRestaurantRequest req)
    {
        var entity = await _db.Restaurants.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
        if (entity.OwnerId != ownerId) return Forbid();

        entity.Name = req.Name.Trim();
        entity.Address = req.Address.Trim();
        entity.RestaurantTypeId = req.RestaurantTypeId;
        entity.Phone = req.Phone;
        entity.OpeningHours = req.OpeningHours;
        entity.ImageUrl = req.ImageUrl;
        entity.Description = req.Description;
        entity.IsActive = req.IsActive;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteRestaurant(Guid id)
    {
        var entity = await _db.Restaurants.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        if (!User.IsInRole("admin"))
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
            if (entity.OwnerId != ownerId) return Forbid();
        }

        _db.Restaurants.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }

}