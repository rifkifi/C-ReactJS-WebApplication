using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenusController : ControllerBase
{
    private readonly AppDbContext _db;
    public MenusController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<MenuResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenus(int page = 1, int pageSize = 20)
    {
        page = page < 1 ? 1 : page;
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Menus.AsNoTracking();
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new MenuResponse(
                x.Id,
                x.Name,
                x.Description,
                x.Price,
                x.RestaurantId,
                x.CategoryId,
                x.Rating,
                x.ImageUrl,
                x.CreatedAt,
                x.IsActive,
                x.RatingCount
            ))
            .ToListAsync();
        return Ok(new ApiResponse<IEnumerable<MenuResponse>>(items, true, "Menus retrieved successfully"));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<MenuResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenu(Guid id)
    {
        var item = await _db.Menus.AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new MenuResponse(
                x.Id,
                x.Name,
                x.Description,
                x.Price,
                x.RestaurantId,
                x.CategoryId,
                x.Rating,
                x.ImageUrl,
                x.CreatedAt,
                x.IsActive,
                x.RatingCount
            )).SingleOrDefaultAsync();
        if (item is null) return NotFound();
        return Ok(new ApiResponse<MenuResponse>(item, true, "Menu retrieved successfully"));
    }

    [HttpGet("restaurant/{restaurantId:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<MenuResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenuByRestaurant(Guid restaurantId)
    {
        var items = await _db.Menus.AsNoTracking()
            .Where(x => x.RestaurantId == restaurantId)
            .Select(x => new MenuResponse(
                x.Id,
                x.Name,
                x.Description,
                x.Price,
                x.RestaurantId,
                x.CategoryId,
                x.Rating,
                x.ImageUrl,
                x.CreatedAt,
                x.IsActive,
                x.RatingCount
            ))
            .ToListAsync();
        if (items is null) return NotFound();
        return Ok(new ApiResponse<IEnumerable<MenuResponse>>(items, true, "Menus retrieved successfully"));
    }


    [HttpPost("create")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<MenuResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateMenu([FromBody] CreateMenuRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || req.Price < 0 || req.RestaurantId == Guid.Empty || req.CategoryId == Guid.Empty)
            return BadRequest(new { success = false, message = "Name, Description, Price, RestaurantId and CategoryId are required" });
        var restaurant = await _db.Restaurants.FirstOrDefaultAsync(x => x.Id == req.RestaurantId);
        if (restaurant is null) return BadRequest(new { success = false, message = "Invalid RestaurantId" });

        var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
        if (restaurant.OwnerId != ownerId) return Forbid();

        var entity = new Menu
        {
            Id = Guid.NewGuid(),
            Name = req.Name.Trim(),
            Description = req.Description ?? "",
            Price = req.Price,
            RestaurantId = req.RestaurantId,
            ImageUrl = req.ImageUrl,
            CategoryId = req.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Menus.Add(entity);
        await _db.SaveChangesAsync();
        var res = new MenuResponse(entity.Id, entity.Name, entity.Description, entity.Price, entity.RestaurantId, entity.CategoryId, 0, entity.ImageUrl, entity.CreatedAt, entity.IsActive, 0);
        return CreatedAtAction(nameof(GetMenu), new { id = entity.Id }, new ApiResponse<MenuResponse>(res, true, "Menu created successfully"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateMenu(Guid id, [FromBody] UpdateMenuRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || req.Price < 0 || req.RestaurantId == Guid.Empty || req.CategoryId == Guid.Empty)
            return BadRequest(new { error = "Name, Description, Price, RestaurantId and CategoryId are required" });

        var entity = await _db.Menus.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = req.Name.Trim();
        entity.Description = req.Description ?? "";
        entity.Price = req.Price;
        entity.RestaurantId = req.RestaurantId;
        entity.CategoryId = req.CategoryId;
        entity.ImageUrl = req.ImageUrl;
        entity.IsActive = req.IsActive;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMenu(Guid id)
    {
        var entity = await _db.Menus.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        if (!User.IsInRole("admin"))
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(sub, out var ownerId)) return Forbid();
            var restaurant = await _db.Restaurants.FirstOrDefaultAsync(x => x.Id == entity.RestaurantId);
            if (restaurant?.OwnerId != ownerId) return Forbid();
        }

        _db.Menus.Remove(entity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
