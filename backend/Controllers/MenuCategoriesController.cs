using Backend.Data;
using Backend.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class MenuCategoriesController : ControllerBase
{

    private readonly AppDbContext _db;
    public MenuCategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<MenuCategoryResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenuCategories()
    {
        var query = _db.MenuCategories.AsNoTracking();
        var items = await query
            .OrderBy(x => x.Name)
            .Select(x => new MenuCategoryResponse(
                x.Id,
                x.Name,
                x.Description,
                x.CreatedAt
            ))
            .ToListAsync();
        return Ok(new ApiResponse<IEnumerable<MenuCategoryResponse>>(items, true, "Menu categories retrieved successfully"));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<MenuCategoryResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMenuCategory(Guid id)
    {
        Console.WriteLine(id);
        var item = await _db.MenuCategories.AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new MenuCategoryResponse(
                x.Id,
                x.Name,
                x.Description,
                x.CreatedAt
            )).SingleOrDefaultAsync();
        if (item is null) return NotFound();
        return Ok(new ApiResponse<MenuCategoryResponse>(item, true, "Menu category retrieved successfully"));
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<MenuCategoryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateMenuCategory([FromBody] CreateMenuCategoryRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Description)) return BadRequest(new { success = false, message = "Some data are missing" });

        var entity = new MenuCategory
        {
            Id = Guid.NewGuid(),
            Name = req.Name,
            Description = req.Description,
            CreatedAt = DateTime.UtcNow
        };
        await _db.MenuCategories.AddAsync(entity);
        await _db.SaveChangesAsync();
        var res = new MenuCategoryResponse(entity.Id, entity.Name, entity.Description, entity.CreatedAt);
        return CreatedAtAction(nameof(GetMenuCategory), new { id = entity.Id }, new ApiResponse<MenuCategoryResponse>(res, true, "Menu category created successfully"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateMenuCategory(Guid id, [FromBody] UpdateMenuCategoryRequest req)
    {
        var entity = await _db.MenuCategories.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = req.Name.Trim();
        entity.Description = req.Description ?? "";
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMenuCategory(Guid id)
    {
        var entity = await _db.MenuCategories.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        _db.MenuCategories.Remove(entity);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }
}